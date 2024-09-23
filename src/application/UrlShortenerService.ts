import { ShortenedURL } from '../domain/ShortenedURL';
import { LoginRepository } from '../infrastructure/LoginRepository';
import { UrlShortenerRepository } from '../infrastructure/UrlShortenerRepository';
import { OwnerRepository } from '../infrastructure/OwnerRepository';
import { SiteRepository } from '../infrastructure/SiteRepository';
import { ShortenerStatsRepository } from '../infrastructure/ShortenerStatsRepository';
import ContactModel from '../models/Contact';
import ContanctLoginModel from '../models/Login';
import dotenv from 'dotenv';

dotenv.config();

export class UrlShortenerService {
  constructor(
    private loginRepository: LoginRepository,
    private urlRepository: UrlShortenerRepository,
    private ownerRepository: OwnerRepository,
    private siteRepository: SiteRepository,
    private statsRepository: ShortenerStatsRepository
  ) {}

  async getContactLogin(username: string) {
    return ContanctLoginModel.findOne({
      where: { username },
      include: [{ model: ContactModel, attributes: ['name', 'contact'] }],
    });
  }

  // Encurtar a URL e persistir apenas o hash
  async shortenUrl(originalUrl: string, user: {name: string, email: string, whatsapp: string}): Promise<string> {
    console.log(`Iniciando processo de encurtamento para URL: ${originalUrl}`);
    const url = new URL(originalUrl);
    const protocol = url.protocol;
    const domain = url.hostname;
    const port = url.port ? `:${url.port}` : '';

    const fullDomain = `${protocol}//${domain}${port}`;
    console.log(`Domínio extraído da URL: ${fullDomain}`);

//    {name: req.body.name, email: req.body.email, whatsapp: req.body.whatsapp});
    let owner = await this.ownerRepository.findByWhatsapp(user.whatsapp);
    // Verificar se o site já está registrado
    let site = await this.siteRepository.findByUrl(fullDomain);

    if (!site) {
      // Se o site não estiver registrado, insere na tabela `sites`
      site = await this.siteRepository.create(fullDomain, domain);
    }

    const shortId = ShortenedURL.generateShortId(); // Gerar o hash/ID encurtado
    console.log(`ID encurtado gerado: ${shortId}`);

    // Persistir apenas o hash
    const shortenedUrl = new ShortenedURL(null, site.id, originalUrl, shortId, new Date());
    await this.urlRepository.create(shortenedUrl);

    console.log(`Processo de encurtamento concluído. Hash persistido: ${shortId}`);
    return shortId; // Retornar apenas o hash
  }

  // Buscar a URL original a partir do hash
  async getOriginalUrl(hash: string, requestIp?: string,  userAgent?: string, browserName?: string, platform?: string, machineData?: string): Promise<ShortenedURL | null> {
    console.log(`Buscando URL original para hash: ${hash}`);
    const shortenedUrl = await this.urlRepository.findByHash(hash);

    if (shortenedUrl && requestIp && userAgent && browserName && platform && machineData) {
      console.log(`Gravando estatísticas de acesso para short_url_id: ${shortenedUrl.id}`);
      await this.statsRepository.save(shortenedUrl.id!, requestIp, browserName, platform, machineData); // Gravando as estatísticas
    }

    return shortenedUrl;
  }

  

  // Método para buscar todas as URLs encurtadas
  async findAllUrls(): Promise<ShortenedURL[]> {
    return await this.urlRepository.findAll();
  }

  // Buscar a URL original e gravar as estatísticas de acesso
  async getStatsForShortUrl(hash: string): Promise<any> {
    const shortenedUrl = await this.urlRepository.findByHash(hash);

    if (!shortenedUrl) {
      throw new Error('URL encurtada não encontrada.');
    }

    // Buscar as estatísticas de acessos para essa URL
    const stats = await this.statsRepository.findByShortUrlId(shortenedUrl.id!);

    // Total de acessos
    const totalAccesses = stats.length;

    // Total de IPs distintos
    const ipCounts = stats.reduce((acc: { [key: string]: number }, stat) => {
      acc[stat.request_ip] = (acc[stat.request_ip] || 0) + 1;
      return acc;
    }, {});

    const totalIps = Object.keys(ipCounts).length;

    // Acessos por dia (supondo que você quer um resumo diário)
    const accessesPerDay = stats.reduce((acc: { [key: string]: number }, stat) => {
      const day = new Date(stat.accessed_at).toISOString().split('T')[0]; // Formato yyyy-mm-dd
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    // Média de acessos por dia
    const totalDays = Object.keys(accessesPerDay).length;
    const averageAccessesPerDay = totalDays ? totalAccesses / totalDays : 0;

    // Porcentagem de participação de cada IP no total de acessos
    const ipPercentage = Object.keys(ipCounts).map(ip => ({
      ip,
      percentage: ((ipCounts[ip] / totalAccesses) * 100).toFixed(2),
      count: ipCounts[ip]
    }));

    return {
      url: shortenedUrl.original_url,
      totalAccesses,
      totalIps,
      averageAccessesPerDay,
      ipPercentage,
      accessesPerDay,
    };
  }
}

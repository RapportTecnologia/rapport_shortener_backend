import { LoginRepository } from '../infrastructure/LoginRepository';
import { UrlShortenerRepository } from '../infrastructure/UrlShortenerRepository';
import { ContactRepository } from '../infrastructure/ContactRepository';
import { SiteRepository } from '../infrastructure/SiteRepository';
import { ShortenerStatsRepository } from '../infrastructure/ShortenerStatsRepository';
import { CampaignRepository } from '../infrastructure/CampaignRepository';
import { UrlShortenerType } from '../types/UrlShortenerType';
import ContactModel from '../domain/Contact';
import ContanctLoginModel from '../domain/Login';
import { UrlShortenerModel } from '../domain/UrlShortener';
import dotenv from 'dotenv';

dotenv.config();

export class UrlShortenerService {

  private static loginRepository = new LoginRepository();
  private static urlRepository = new UrlShortenerRepository();
  private static ownerRepository = new ContactRepository();
  private static siteRepository = new SiteRepository();
  private static statsRepository = new ShortenerStatsRepository();
  private static campaignRepository = new CampaignRepository();

private static service:UrlShortenerService; 
  static createUrlShortenerService(){
    if( !UrlShortenerService.service ){
      UrlShortenerService.service = new UrlShortenerService(
        UrlShortenerService.loginRepository, 
        UrlShortenerService.urlRepository, 
        UrlShortenerService.ownerRepository, 
        UrlShortenerService.siteRepository, 
        UrlShortenerService.statsRepository,
        UrlShortenerService.campaignRepository);
    }
    return UrlShortenerService.service;
  }

  constructor(
    private loginRepository: LoginRepository,
    private urlRepository: UrlShortenerRepository,
    private contactRepository: ContactRepository,
    private siteRepository: SiteRepository,
    private statsRepository: ShortenerStatsRepository,
    private campaignRepository: CampaignRepository,
  ) {}

  async getContactLogin(username: string) {
    return ContanctLoginModel.findOne({
      where: { username },
      include: [{ model: ContactModel, attributes: ['name', 'contact'] }],
    });
  }

  /**
   * Encurta a URL levando em consideração a origem e destino  da mensagem no whatsapp.
   * 
   * A origem {whatsappFrom} é o whatsapp do bot, em versões futura poderá ser o whatsapp de envio.
   * O destino {whatsappFrom} é o whatsapp a que se destina a mensagem e terá um url própria para ele.
   * Se UTM for infomrado e a URL já tiver UTM haverá a duplicidade dos parametros causando um comportamento desconhecido dos sistemas de analise.
   * 
   * @param {string} originalUrl - URL original a ser encurtada
   * @param (string) from - whatsapp ou contato no telegram que origina o envio
   * @param (string) dest - whatsapp ou contato no telegram que se destina o envio
   * @param {string} utm - parametro opcional que contém as informações de Campanhas
   */
  async shortenUrlTo(originalUrl: string, from: ContactModel, dest: ContactModel, 
    utm?: {campaign?: string, source?: string, medium?: string, utm_term?: string, utm_content?: string}) {
    const url = await this.shortenUrl(originalUrl, from);

    // TODO Verificar como atualizar o modelo contact sem criar uma nova instância
    let destNew = await this.contactRepository.findByContact(dest.contact);
    if(!destNew){
      destNew = await this.contactRepository.create(dest.name, dest.email, dest.contact, dest.type, dest.origem, dest.description);
    }

  }
  /**
   * Encurtar a URL e persistir apenas o hash
   */ 
  async shortenUrl(originalUrl: string, user: ContactModel): Promise<string> {
    console.log(`Iniciando processo de encurtamento para URL: ${originalUrl}, para usuário ${JSON.stringify(user)}`);
    const url = new URL(originalUrl);
    const protocol = url.protocol;
    const domain = url.hostname;
    const port = url.port ? `:${url.port}` : '';

    const fullDomain = `${protocol}//${domain}${port}`;
    console.log(`Domínio extraído da URL: ${fullDomain}`);

//    {name: req.body.name, email: req.body.email, whatsapp: req.body.whatsapp});
    let owner = await this.contactRepository.findByContact(user.contact);
    // Verificar se o site já está registrado
    let site = await this.siteRepository.findByUrl(fullDomain);

    if (!site) {
      // Se o site não estiver registrado, insere na tabela `sites`
      site = await this.siteRepository.create({url: fullDomain, name: domain, ownerContact: user.contact});
    }

    const shortId = UrlShortenerModel.generateShortId(); // Gerar o hash/ID encurtado
    console.log(`ID encurtado gerado: ${shortId}`);

    // Persistir apenas o hash
    const shortenedUrl = new UrlShortenerType(null, site.id, originalUrl, shortId, new Date());
    await this.urlRepository.create(shortenedUrl, owner as ContactModel);

    console.log(`Processo de encurtamento concluído. Hash persistido: ${shortId}`);
    return shortId; // Retornar apenas o hash
  }

  // Buscar a URL original a partir do hash
  async getOriginalUrl(hash: string, requestIp?: string,  userAgent?: string, browserName?: string, platform?: string, machineData?: string): Promise<UrlShortenerModel | null> {
    console.log(`Buscando URL original para hash: ${hash}`);
    const shortenedUrl = await this.urlRepository.findByHash(hash);

    if (shortenedUrl && requestIp && userAgent && browserName && platform && machineData) {
      console.log(`Gravando estatísticas de acesso para short_url_id: ${shortenedUrl.id}`);
      await this.statsRepository.save(shortenedUrl.id!, requestIp, browserName, platform, machineData); // Gravando as estatísticas
    }

    return shortenedUrl;
  }

  

  // Método para buscar todas as URLs encurtadas
  async findAllUrls(): Promise<UrlShortenerModel[]> {
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
      url: shortenedUrl.originalUrl,
      totalAccesses,
      totalIps,
      averageAccessesPerDay,
      ipPercentage,
      accessesPerDay,
    };
  }
}

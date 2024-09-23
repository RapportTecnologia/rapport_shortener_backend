import { Request, Response } from 'express';
import { UrlShortenerService } from '../application/UrlShortenerService';
import { OwnerRepository } from '../infrastructure/OwnerRepository';
import { UrlShortenerRepository } from '../infrastructure/UrlShortenerRepository';
import { SiteRepository } from '../infrastructure/SiteRepository';
import { ShortenerStatsRepository } from '../infrastructure/ShortenerStatsRepository';
import { LoginRepository } from '../infrastructure/LoginRepository';

const loginRepository = new LoginRepository();
const urlRepository = new UrlShortenerRepository();
const ownerRepository = new OwnerRepository();
const siteRepository = new SiteRepository();
const statsRepository = new ShortenerStatsRepository();
const service = new UrlShortenerService(loginRepository, urlRepository, ownerRepository, siteRepository, statsRepository);

export class UrlShortenerController {
  async authUser(req: Request, res: Response) {
    console.log(req.body)

    const username = req.body.username;
    const passwd = req.body.password;

    try {
      console.log(`Autenticando usuário: ${username} --> senha: ${passwd}`)
      const contactLogin = await service.getContactLogin(username);

      console.log("------");
      console.log(`Contato: ${JSON.stringify(contactLogin?.toJSON())}`);
      if (!contactLogin) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const autenticated = contactLogin ? contactLogin.password == passwd : false;

      //console.log(`Usuário ${contactLogin?.name} - Login: ${contactLogin?.username} - Autenticado: ${autenticated}`);
      const user ={
        username: contactLogin.username,
        //@ts-ignore
        name: contactLogin.ContactModel.name,
        //@ts-ignore
        whatsapp: contactLogin.ContactModel.contact,
        //@ts-ignore
        email: contactLogin.ContactModel.email,
      };
      return res.status(200).json({ autenticated, user });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.mensage })
    }
  }

  async shorten(req: Request, res: Response) {
    console.log(`Recebida requisição para encurtar URL: ${req.body.url}`);
    try {
      const hash = await service.shortenUrl(req.body.url,
        { name: req.body.name, email: req.body.email, whatsapp: req.body.whatsapp });
      const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${hash}`; // Construir a URL completa
      res.json({ shortUrl });
    } catch (error) {
      console.error('Erro ao encurtar a URL:', error);
      res.status(500).json({ message: 'Erro ao encurtar a URL' });
    }
  }

  async redirect(req: Request, res: Response) {
    console.log(`Recebida requisição para redirecionar shortUrl: ${req.params.shortId}`);

    try {
      const shortUrl = req.params.shortId;

      // Captura o IP de origem da requisição

      const headers = req.headers as { [key: string]: string };
      const requestIp = headers['x-forwarded-for'] || req.ip;
      const userAgent = headers['user-agent'];
      const browserName = userAgent.split('/')[0].trim();
      const platform = headers['sec-ch-ua-platform'];
      const machineData = userAgent.split(')')[1].trim().split(';')[0].trim();

      console.log(`IP de origem: ${requestIp}, navegador: ${browserName}, plataforma: ${platform}, dados do computador: ${machineData}`);
      const originalUrl = await service.getOriginalUrl(shortUrl, requestIp as string, userAgent, browserName, platform, machineData); // Passa o IP para registro

      if (originalUrl) {
        console.log(`Redirecionando para URL original: ${originalUrl.original_url}`);
        res.redirect(originalUrl.original_url);
      } else {
        console.log(`ShortUrl não encontrada: ${shortUrl}`);
        res.status(404).send('URL não encontrada');
      }
    } catch (error) {
      console.error('Erro ao redirecionar:', error);
      res.status(500).send('Erro ao redirecionar');
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const hash = req.params.shortId;
      const stats = await service.getStatsForShortUrl(hash);
      const originalURL = await service.getOriginalUrl(hash);
      stats.originalURL = originalURL?.original_url;
      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
  }

  async getAllUrls(req: Request, res: Response) {
    try {
      const urls = await service.findAllUrls(); // Chama o serviço
      res.json(urls);
    } catch (error) {
      console.error('Erro ao buscar todas as URLs encurtadas:', error);
      res.status(500).json({ message: 'Erro ao buscar URLs encurtadas.' });
    }
  }
}

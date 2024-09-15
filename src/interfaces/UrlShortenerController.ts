import { Request, Response } from 'express';
import { UrlShortenerService } from '../application/UrlShortenerService';
import { UrlShortenerRepository } from '../infrastructure/UrlShortenerRepository';
import { SiteRepository } from '../infrastructure/SiteRepository';
import { ShortenerStatsRepository } from '../infrastructure/ShortenerStatsRepository'

const urlRepository = new UrlShortenerRepository();
const siteRepository = new SiteRepository();
const statsRepository = new ShortenerStatsRepository();
const service = new UrlShortenerService(urlRepository, siteRepository, statsRepository);

export class UrlShortenerController {
  async shorten(req: Request, res: Response) {
    console.log(`Recebida requisição para encurtar URL: ${req.body.url}`);
    try {
      const hash = await service.shortenUrl(req.body.url);
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
      const requestIp = req.ip;
      console.log(`Registrando acesso de IP: ${requestIp}`);

      const originalUrl = await service.getOriginalUrl(shortUrl, requestIp as string); // Passa o IP para registro

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

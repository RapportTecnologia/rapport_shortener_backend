import ContactModel from '../domain/Contact';
import { UrlShortenerModel } from '../domain/UrlShortener'; 
import { UrlShortenerType } from '../types/UrlShortenerType';

export class UrlShortenerRepository {
  // Método para criar o encurtamento da URL e associar ao site, persistindo o hash
  async create(shortenedUrl: UrlShortenerType|UrlShortenerModel, owner: ContactModel): Promise<void> {
    console.log(`Persistindo hash para site_id: ${shortenedUrl.siteId}, originalUrl: ${shortenedUrl.originalUrl}`);
    try {
      await UrlShortenerModel.create({
        siteId: shortenedUrl.siteId as number, // Ajustado para site_id
        originalUrl: shortenedUrl.originalUrl as string, // Ajustado para originalUrl
        hash: shortenedUrl.hash as string, // Persistir apenas o hash
        createdAt: shortenedUrl.createdAt as Date, // Ajustado para createdAt
        contactId: owner.id as number
      });
      console.log('Hash criado com sucesso.');
    } catch (error) {
      console.error('Erro ao criar o hash:', error);
      throw error;
    }
  }

  // Buscar a URL original com base no hash
  async findByHash(hash: string): Promise<UrlShortenerModel | null> {
    const result = await UrlShortenerModel.findOne({ where: { hash } }) as UrlShortenerModel | null;

    if (!result) {
      console.log(`Hash não encontrado: ${hash}`);
      return null;
    }

    console.log(`Hash encontrado: ${hash}`);
    return result;
  }

  async findAll(): Promise<UrlShortenerModel[]> {
    try {
      const urls = await UrlShortenerModel.findAll();
      return urls;
    } catch (error) {
      console.error('Erro ao buscar todas as URLs encurtadas:', error);
      throw error;
    }
  }
}

import { UrlShortenerModel } from './UrlShortenerModel';
import { ShortenedURL } from '../domain/ShortenedURL';

export class UrlShortenerRepository {
  // Método para criar o encurtamento da URL e associar ao site, persistindo o hash
  async create(shortenedUrl: ShortenedURL): Promise<void> {
    console.log(`Persistindo hash para site_id: ${shortenedUrl.site_id}, original_url: ${shortenedUrl.original_url}`);
    try {
      await UrlShortenerModel.create({
        site_id: shortenedUrl.site_id, // Ajustado para site_id
        original_url: shortenedUrl.original_url, // Ajustado para original_url
        hash: shortenedUrl.hash, // Persistir apenas o hash
        created_at: shortenedUrl.created_at, // Ajustado para created_at
      });
      console.log('Hash criado com sucesso.');
    } catch (error) {
      console.error('Erro ao criar o hash:', error);
      throw error;
    }
  }

  // Buscar a URL original com base no hash
  async findByHash(hash: string): Promise<ShortenedURL | null> {
    const result = await UrlShortenerModel.findOne({ where: { hash } }) as UrlShortenerModel | null;

    if (!result) {
      console.log(`Hash não encontrado: ${hash}`);
      return null;
    }

    console.log(`Hash encontrado: ${hash}`);
    return new ShortenedURL(
      result.id,
      result.site_id, // Ajustado para site_id
      result.original_url, // Ajustado para original_url
      result.hash,
      result.created_at // Ajustado para created_at
    );
  }

  async findAll(): Promise<ShortenedURL[]> {
    try {
      const urls = await UrlShortenerModel.findAll();
      return urls;
    } catch (error) {
      console.error('Erro ao buscar todas as URLs encurtadas:', error);
      throw error;
    }
  }
}

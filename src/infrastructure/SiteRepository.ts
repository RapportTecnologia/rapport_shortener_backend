import ContactModel from '../domain/Contact';
import SiteModel from '../domain/Site';

export class SiteRepository {
  // Método para encontrar um site pelo URL completo
  async findByUrl(url: string): Promise<SiteModel | null> {
    console.log(`Buscando site pelo URL: ${url}`);
    const site = await SiteModel.findOne({ where: { url } });

    if (site) {
      console.log(`Site encontrado: ${site.id} - ${site.url}`);
    } else {
      console.log(`Site não encontrado, será criado.`);
    }

    return site;
  }

  // Método para criar um novo registro na tabela `sites`
  async create(siteData: { name: string, url: string, ownerContact: string }) {
    try {
      // Buscar o contato (Owner) pelo número de telefone
      const owner = await ContactModel.findOne({ where: { contact: siteData.ownerContact } });
      if (!owner) {
        throw new Error(`Owner com o contato ${siteData.ownerContact} não encontrado.`);
      }
      console.log(`Usando Owner: ${JSON.stringify(owner)}`)
      // Verificar se o site já existe
      const existingSite = await SiteModel.findOne({ where: { url: siteData.url } });
      if (existingSite) {
        return existingSite; // Site já existe, retorna o existente
      }

      // Criar o novo site com o contact_id do owner
      const newSite = await SiteModel.create({
        name: siteData.name,
        url: siteData.url,
        contactId: owner.id, // Adicionando o contact_id corretamente
      });

      return newSite;
    } catch (error) {
      console.error('Erro ao criar o site:', error);
      throw error; // Relançar o erro para ser tratado na camada superior
    }
  }

}
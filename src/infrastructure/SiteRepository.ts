import { sequelize } from './database';
import { DataTypes, Model } from 'sequelize';

export class SiteModel extends Model {
  public id!: number;
  public name!: string;
  public url!: string;
}

SiteModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'sites',
  timestamps: false
});

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
  async create(fullUrl: string, name: string): Promise<SiteModel> {
    console.log(`Criando novo site: ${fullUrl} - ${name}`);
    try {
      const newSite = await SiteModel.create({ url: fullUrl, name });
      console.log(`Novo site criado com sucesso: ${newSite.id}`);
      return newSite;
    } catch (error) {
      console.error('Erro ao criar o site:', error);
      throw error;
    }
  }
}

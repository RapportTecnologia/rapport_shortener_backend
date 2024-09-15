import { sequelize } from './database';
import { DataTypes, Model, Optional } from 'sequelize';

// Definir os atributos que correspondem à tabela do banco de dados
interface UrlShortenerAttributes {
  id: number;
  site_id: number;
  original_url: string;
  hash: string;
  created_at: Date;
}

// Definir quais atributos são opcionais durante a criação de uma nova instância
interface UrlShortenerCreationAttributes extends Optional<UrlShortenerAttributes, 'id' | 'created_at'> {}

// Definir o modelo com tipagem correta para os atributos e a criação
export class UrlShortenerModel extends Model<UrlShortenerAttributes, UrlShortenerCreationAttributes> 
  implements UrlShortenerAttributes {
  public id!: number;
  public site_id!: number;
  public original_url!: string;
  public hash!: string;
  public created_at!: Date;
}

UrlShortenerModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  site_id: { type: DataTypes.INTEGER, allowNull: false }, // camelCase no modelo
  original_url: { type: DataTypes.STRING, allowNull: false },
  hash: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'sites_shortenes',
  timestamps: false
});

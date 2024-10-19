import { sequelize } from '../infrastructure/database';
import { DataTypes, Model, Optional } from 'sequelize';
import ContactModel from './Contact';

// Definir os atributos que correspondem à tabela do banco de dados
interface UrlShortenerAttributes {
  id?: number;
  siteId: number;
  originalUrl: string;
  hash: string;
  createdAt?: Date;
  contactId: number;
}

// Definir quais atributos são opcionais durante a criação de uma nova instância
interface UrlShortenerCreationAttributes extends Optional<UrlShortenerAttributes, 'id' | 'createdAt'> {}

// Definir o modelo com tipagem correta para os atributos e a criação
export class UrlShortenerModel extends Model<UrlShortenerAttributes, UrlShortenerCreationAttributes> 
  implements UrlShortenerAttributes {
    public id!: number;
    public siteId!: number;
    public originalUrl!: string;
    public hash!: string;
    public createdAt!: Date;
    public contactId!: number;

  static generateShortId(): string {
    return Buffer.from(Math.random().toString()).toString('base64').substr(0, 8);
  }
}

UrlShortenerModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  siteId: { type: DataTypes.INTEGER, allowNull: false, field: 'site_id'},
  originalUrl: { type: DataTypes.STRING, allowNull: false, field: 'original_url' },
  hash: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  contactId: {
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: ContactModel, // refere-se ao modelo Contact
      key: 'id',
    },
    field: 'contact_id'
  },

}, {
  sequelize,
  tableName: 'sites_shorteners',
  timestamps: false
});


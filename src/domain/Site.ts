import { sequelize } from '../infrastructure/database';
import { DataTypes, Model } from 'sequelize';
import ContactModel from '../domain/Contact';

export default class SiteModel extends Model {
  public id!: number;
  public name!: string;
  public url!: string;
  public contactId!: number;
}

SiteModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
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
  tableName: 'sites',
  timestamps: false
});
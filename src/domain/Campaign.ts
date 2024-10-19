import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../infrastructure/database';
import ContactModel from './Contact';

class CampaingModel extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public contatctId!: number;
  public createdAt!: Date;
}

CampaingModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(512),
    },
    contactId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: ContactModel, // refere-se ao modelo Contact
        key: 'id',
      },
      field: 'contact_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
  },
  {
    sequelize,
    tableName: 'campaigns',
    timestamps: false,
  }
);

export default ContactModel;

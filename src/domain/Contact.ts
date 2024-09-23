import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../infrastructure/database';

class ContactModel extends Model {
  public id!: number;
  public contact!: string;
  public name!: string;
  public type!: 'whatsapp_user' | 'whatsapp_group' | 'telgram_group' | 'telegram_user';
  public origem!: string;
  public description!: string;
  public createdAt!: Date;
}

ContactModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    contact: {
      type: DataTypes.STRING(45),
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    type: {
      type: DataTypes.ENUM('whatsapp_user', 'whatsapp_group', 'telgram_group', 'telegram_user'),
    },
    origem: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(512),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    timestamps: false,
  }
);

export default ContactModel;

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../infrastructure/database';
import ContactModel from './Contact';

class ContactLoginModel extends Model {
  public contactId!: number;
  public username!: string;
  public password!: string;
  public createAt!: Date;
  public enabled!: boolean;
}

ContactLoginModel.init(
  {
    contactId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: ContactModel, // refere-se ao modelo Contact
        key: 'id',
      },
      field: 'contact_id'
    },
    username: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: false,
      primaryKey: true,  
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
  },
  {
    sequelize,
    tableName: 'logins',
    timestamps: false,
  }
);

ContactLoginModel.belongsTo(ContactModel, { foreignKey: 'contactId' });

export default ContactLoginModel;

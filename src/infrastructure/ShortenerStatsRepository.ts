import { sequelize } from './database';
import { DataTypes, Model } from 'sequelize';

export class ShortenerStatsModel extends Model {
  public id!: number;
  public short_url_id!: number;
  public accessed_at!: Date;
  public request_ip!: string;
}

ShortenerStatsModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  short_url_id: { type: DataTypes.INTEGER, allowNull: false },
  accessed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  request_ip: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'sites_shortener_stats',
  timestamps: false
});

export class ShortenerStatsRepository {
  async save(short_url_id: number, request_ip: string): Promise<void> {
    try {
      await ShortenerStatsModel.create({
        short_url_id,
        request_ip,
      });
      console.log('Estatísticas de acesso gravadas com sucesso.');
    } catch (error) {
      console.error('Erro ao gravar as estatísticas de acesso:', error);
      throw error;
    }
  }

  async findByShortUrlId(short_url_id: number): Promise<ShortenerStatsModel[]> {
    try {
      const stats = await ShortenerStatsModel.findAll({
        where: { short_url_id },
        order: [['accessed_at', 'DESC']],
      });
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

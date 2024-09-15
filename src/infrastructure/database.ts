import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  }
);

// Verificando a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso com o banco de dados');
  })
  .catch((err: Error) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

import {Sequelize} from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
          require: true, // Obliga a usar SSL para la conexión
          rejectUnauthorized: false, // Acepta certificados auto-firmados
        },
      },
});

export default db;
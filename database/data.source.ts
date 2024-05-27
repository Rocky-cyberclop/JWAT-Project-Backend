import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * This function will custom the environment variable for 
 * loading DataSourceOptions then return a DataSourceOptions 
 * when run migration
 * @returns DataSourceOptions
 */
function dynamicConfigDatabaseMyself(): DataSourceOptions {
  const envFilePath = path.resolve(process.cwd(), `.env.${dotenv.config().parsed.NODE_ENV}.local`);
  dotenv.config({ path: envFilePath });
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/database/migrations/*.js'],
  }
}

export const dataSourceOptions: DataSourceOptions = dynamicConfigDatabaseMyself();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

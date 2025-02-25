import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Load the appropriate .env file based on NODE_ENV
config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

if (
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_PORT ||
  !process.env.DATABASE_NAME ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_PASSWORD
) {
  throw new Error('Missing required database environment variables');
}

const isDevelopment = process.env.NODE_ENV === 'development';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false,
  logging: isDevelopment,
  logger: isDevelopment ? 'advanced-console' : 'simple-console',
  maxQueryExecutionTime: isDevelopment ? 1000 : 2000, // Log slow queries
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  migrationsTableName: 'migrations',
};

export const dataSourceOptions: TypeOrmModuleOptions = dataSourceConfig;
export const AppDataSource = new DataSource(dataSourceConfig);

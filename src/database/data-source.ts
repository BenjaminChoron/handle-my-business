import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

const getEnvVar = (prod: string, test: string): string => {
  const value =
    process.env.NODE_ENV === 'test' ? process.env[test] : process.env[prod];
  if (!value)
    throw new Error(
      `Missing environment variable: ${process.env.NODE_ENV === 'test' ? test : prod}`,
    );

  return value;
};

const isDevelopment = process.env.NODE_ENV === 'development';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: getEnvVar('DEV_POSTGRES_HOST', 'TEST_POSTGRES_HOST'),
  port: parseInt(getEnvVar('DEV_POSTGRES_PORT', 'TEST_POSTGRES_PORT'), 10),
  database: getEnvVar('DEV_POSTGRES_DB', 'TEST_POSTGRES_DB'),
  username: getEnvVar('DEV_POSTGRES_USER', 'TEST_POSTGRES_USER'),
  password: getEnvVar('DEV_POSTGRES_PASSWORD', 'TEST_POSTGRES_PASSWORD'),
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

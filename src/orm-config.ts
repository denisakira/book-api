import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false, // Set to false in production
  logging: true,
};

const e2eDataSourceOptions: DataSourceOptions = {
  ...dataSourceOptions,
  entities: [join(__dirname, '..', 'src', '**', '*.entity.{ts,js}')],
};

export const getDataSourceOptions = () => {
  if (process.env.NODE_ENV === 'test') {
    return e2eDataSourceOptions;
  }
  return dataSourceOptions;
};

export const dataSource = new DataSource(dataSourceOptions);

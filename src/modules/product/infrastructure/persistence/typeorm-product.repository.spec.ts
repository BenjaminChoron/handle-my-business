import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../../domain/entities/product.entity';
import { TypeORMProductEntity } from './typeorm-product.entity';
import { TypeORMProductRepository } from './typeorm-product.repository';

describe('TypeORMProductRepository', () => {
  let repository: TypeORMProductRepository;
  let typeormRepository: Repository<TypeORMProductEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('TEST_POSTGRES_HOST')!,
            port: parseInt(configService.get('TEST_POSTGRES_PORT')!),
            username: configService.get('TEST_POSTGRES_USER')!,
            password: configService.get('TEST_POSTGRES_PASSWORD')!,
            database: configService.get('TEST_POSTGRES_DB')!,
            entities: [TypeORMProductEntity],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([TypeORMProductEntity]),
      ],
      providers: [TypeORMProductRepository],
    }).compile();

    repository = moduleRef.get<TypeORMProductRepository>(
      TypeORMProductRepository,
    );
    typeormRepository = moduleRef.get<Repository<TypeORMProductEntity>>(
      'TypeORMProductEntityRepository',
    );
  }, 30000);

  afterEach(async () => {
    await typeormRepository.clear();
  });

  it('should save and retrieve a product', async () => {
    const productId = crypto.randomUUID();
    const product = new Product(
      productId,
      'Product A',
      'Description A',
      100,
      10,
      new Date(),
      new Date(),
    );

    await repository.save(product);

    const fetchedProduct = await repository.findById(productId);
    expect(fetchedProduct).toEqual(product);
  });

  it('should delete a product by id', async () => {
    const productId = crypto.randomUUID();
    const product = new Product(
      productId,
      'Product B',
      'Description B',
      200,
      20,
      new Date(),
      new Date(),
    );

    await repository.save(product);
    await repository.deleteById(productId);

    const fetchedProduct = await repository.findById(productId);
    expect(fetchedProduct).toBeNull();
  });
});

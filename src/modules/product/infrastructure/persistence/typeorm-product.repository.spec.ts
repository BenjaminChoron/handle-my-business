import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMProductRepository } from './typeorm-product.repository';
import { TypeORMProductEntity } from './typeorm-product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Product } from '../../domain/entities/product.entity';

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
            host: configService.get('TEST_POSTGRES_HOST'),
            port: parseInt(configService.get('TEST_POSTGRES_PORT') || '5432'),
            username: configService.get('TEST_POSTGRES_USER'),
            password: configService.get('TEST_POSTGRES_PASSWORD'),
            database: configService.get('TEST_POSTGRES_DB'),
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

  it('should save and retrieve a product with correct properties', async () => {
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

    const savedProduct = await repository.findById(productId);
    expect(savedProduct).toBeDefined();
    expect(savedProduct?.id).toBe(product.id);
    expect(savedProduct?.name).toBe(product.name);
    expect(savedProduct?.price).toBe(product.price);
    expect(savedProduct?.stock).toBe(product.stock);
    expect(savedProduct?.description).toBe(product.description);
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

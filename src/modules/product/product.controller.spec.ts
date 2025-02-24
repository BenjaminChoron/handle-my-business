import { ConfigModule } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from '../auth/infrastructure/security/auth.guard';
import { PublicGuard } from '../auth/infrastructure/security/public.guard';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      controllers: [ProductController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PublicGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductController>(ProductController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it('should create a product', async () => {
    const dto: CreateProductDTO = {
      name: 'Product A',
      description: 'Description A',
      price: 100,
      stock: 10,
    };

    await controller.createProduct(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Product A',
        description: 'Description A',
        price: 100,
        stock: 10,
      }),
    );
  });

  it('should retrieve a product by id', async () => {
    (queryBus.execute as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Product A',
    });
    const result = await controller.getProduct('1');
    expect(result).toEqual({ id: '1', name: 'Product A' });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDTO } from './dtos/create-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    commandBus = { execute: jest.fn() } as any;
    queryBus = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
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
    queryBus.execute.mockResolvedValue({ id: '1', name: 'Product A' });

    const result = await controller.getProduct('1');

    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual({ id: '1', name: 'Product A' });
  });
});

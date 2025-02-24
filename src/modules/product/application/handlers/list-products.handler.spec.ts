import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ListProductsQuery } from '../queries/list-products.query';
import { ListProductsHandler } from './list-products.handler';

describe('ListProductsHandler', () => {
  let handler: ListProductsHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new ListProductsHandler(productRepository);
  });

  it('should return a list of products', async () => {
    const products = [
      new Product('1', 'Product 1', 'Desc 1', 100, 10, new Date(), new Date()),
      new Product('2', 'Product 2', 'Desc 2', 200, 20, new Date(), new Date()),
    ];
    productRepository.findAll.mockResolvedValue(products);

    const query = new ListProductsQuery(1, 10);
    const result = await handler.execute(query);

    expect(result).toEqual(products);
    expect(productRepository.findAll).toHaveBeenCalled();
  });
});

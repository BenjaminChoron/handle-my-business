import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { GetProductQuery } from '../queries/get-product.query';
import { GetProductHandler } from './get-product.handler';

describe('GetProductHandler', () => {
  let handler: GetProductHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new GetProductHandler(productRepository);
  });

  it('should return a product when it exists', async () => {
    const product = new Product(
      '1',
      'Test Product',
      'Description',
      100,
      10,
      new Date(),
      new Date(),
    );
    productRepository.findById.mockResolvedValue(product);

    const query = new GetProductQuery('1');
    const result = await handler.execute(query);

    expect(result).toEqual(product);
    expect(productRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    const query = new GetProductQuery('1');
    const result = await handler.execute(query);

    expect(result).toBeNull();
  });
});

import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { DeleteProductHandler } from './delete-product.handler';

describe('DeleteProductHandler', () => {
  let handler: DeleteProductHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new DeleteProductHandler(productRepository);
  });

  it('should delete a product', async () => {
    const product = new Product(
      '1',
      'Test',
      'Desc',
      100,
      10,
      new Date(),
      new Date(),
    );
    productRepository.findById.mockResolvedValue(product);

    const command = new DeleteProductCommand('1');
    await handler.execute(command);

    expect(productRepository.deleteById).toHaveBeenCalledWith('1');
  });
});

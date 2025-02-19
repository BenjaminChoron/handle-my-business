import { DeleteProductHandler } from './delete-product.handler';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';

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
    const command = new DeleteProductCommand('1');
    await handler.execute(command);

    expect(productRepository.deleteById).toHaveBeenCalledWith('1');
  });
});

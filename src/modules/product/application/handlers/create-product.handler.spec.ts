import { CreateProductHandler } from './create-product.handler';
import { CreateProductCommand } from '../commands/create-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new CreateProductHandler(productRepository);
  });

  it('should create a product and save it to the repository', async () => {
    const command = new CreateProductCommand(
      'Product A',
      'Description',
      100,
      10,
    );

    await handler.execute(command);

    expect(productRepository.save).toHaveBeenCalledWith(
      expect.any(Product), // Vérifie qu'un produit a été créé
    );
  });
});

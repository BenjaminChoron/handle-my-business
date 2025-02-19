import { UpdateProductHandler } from './update-product.handler';
import { UpdateProductCommand } from '../commands/update-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';

describe('UpdateProductHandler', () => {
  let handler: UpdateProductHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new UpdateProductHandler(productRepository);
  });

  it('should update a product if it exists', async () => {
    const existingProduct = new Product(
      '1',
      'Old Name',
      'Old Description',
      50,
      5,
      new Date(),
      new Date(),
    );
    productRepository.findById.mockResolvedValue(existingProduct);

    const command = new UpdateProductCommand(
      '1',
      'New Name',
      'New Description',
      100,
      10,
    );
    await handler.execute(command);

    expect(existingProduct.name).toBe('New Name');
    expect(existingProduct.description).toBe('New Description');
    expect(existingProduct.price).toBe(100);
    expect(existingProduct.stock).toBe(10);
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct);
  });

  it('should throw ProductNotFoundException if product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    const command = new UpdateProductCommand(
      '1',
      'New Name',
      'New Description',
      100,
      10,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      'Product with id 1 not found',
    );
    await expect(handler.execute(command)).rejects.toThrow(
      ProductNotFoundException,
    );
  });
});

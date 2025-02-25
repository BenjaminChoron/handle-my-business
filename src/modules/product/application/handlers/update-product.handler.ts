import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProductCommand } from '../commands/update-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  InvalidProductDataException,
  ProductNotFoundException,
} from '../../domain/exceptions/product.exceptions';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const { id, price, stock, name, description } = command;

    if (price < 0) {
      throw new InvalidProductDataException('Price cannot be negative');
    }

    if (stock < 0) {
      throw new InvalidProductDataException('Stock cannot be negative');
    }

    const product = await this.productRepo.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    product.updateDetails(name, description, price, stock);
    await this.productRepo.save(product);
  }
}

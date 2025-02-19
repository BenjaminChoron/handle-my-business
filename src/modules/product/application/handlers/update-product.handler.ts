import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProductCommand } from '../commands/update-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  ProductNotFoundException,
  InvalidProductDataException,
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
    if (command.price < 0) {
      throw new InvalidProductDataException('Price cannot be negative');
    }
    if (command.stock < 0) {
      throw new InvalidProductDataException('Stock cannot be negative');
    }

    const product = await this.productRepo.findById(command.id);
    if (!product) {
      throw new ProductNotFoundException(command.id);
    }

    product.updateDetails(
      command.name,
      command.description,
      command.price,
      command.stock,
    );
    await this.productRepo.save(product);
  }
}

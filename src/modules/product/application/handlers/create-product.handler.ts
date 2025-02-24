import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../commands/create-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { InvalidProductDataException } from '../../domain/exceptions/product.exceptions';
import * as crypto from 'crypto';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const { price, stock, name, description } = command;
    if (price < 0) {
      throw new InvalidProductDataException('Price cannot be negative');
    }
    if (stock < 0) {
      throw new InvalidProductDataException('Stock cannot be negative');
    }

    const product = new Product(
      crypto.randomUUID(),
      name,
      description,
      price,
      stock,
      new Date(),
      new Date(),
    );

    await this.productRepo.save(product);
  }
}

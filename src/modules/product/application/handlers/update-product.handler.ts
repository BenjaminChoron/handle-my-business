import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProductCommand } from '../commands/update-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const product = await this.productRepo.findById(command.id);
    if (!product) throw new Error('Product not found');

    product.updateDetails(
      command.name,
      command.description,
      command.price,
      command.stock,
    );
    await this.productRepo.save(product);
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const { id } = command;
    const product = await this.productRepo.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepo.deleteById(id);
  }
}

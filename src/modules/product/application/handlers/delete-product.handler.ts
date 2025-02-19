import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { ProductRepository } from '../../domain/repositories/product.repository';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    await this.productRepo.deleteById(command.id);
  }
}

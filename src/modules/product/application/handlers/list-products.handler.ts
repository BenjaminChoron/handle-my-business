import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ListProductsQuery } from '../queries/list-products.query';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<ListProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<Product[]> {
    const { page, limit } = query;
    const products = await this.productRepo.findAll(page, limit);

    return products;
  }
}

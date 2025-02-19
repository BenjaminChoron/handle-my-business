import { IQuery } from '@nestjs/cqrs';

export class ListProductsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

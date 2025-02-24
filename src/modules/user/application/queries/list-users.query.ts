import { IQuery } from '@nestjs/cqrs';

export class ListUsersQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

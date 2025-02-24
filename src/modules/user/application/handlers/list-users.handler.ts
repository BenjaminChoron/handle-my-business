import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: ListUsersQuery): Promise<any[]> {
    const { page, limit } = query;
    const users = await this.userRepository.findAll(page, limit);

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}

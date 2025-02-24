import { ListUsersHandler } from './list-users.handler';
import { ListUsersQuery } from '../queries/list-users.query';
import { UserRepository } from '../../domain/repositories/user.repository';

describe('ListUsersHandler', () => {
  let handler: ListUsersHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new ListUsersHandler(userRepository);
  });

  it('should return list of users', async () => {
    const mockUsers = [
      { id: '1', email: 'test1@example.com' },
      { id: '2', email: 'test2@example.com' },
    ];
    userRepository.findAll.mockResolvedValue(mockUsers as any);

    const query = new ListUsersQuery(1, 10);
    const result = await handler.execute(query);

    expect(result).toEqual(mockUsers);
    expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});

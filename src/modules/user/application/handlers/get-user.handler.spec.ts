import { UserNotFoundException } from '../../domain/exceptions/user.exceptions';
import { UserRepository } from '../../domain/repositories/user.repository';
import { GetUserQuery } from '../queries/get-user.query';
import { GetUserHandler } from './get-user.handler';

describe('GetUserHandler', () => {
  let handler: GetUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new GetUserHandler(userRepository);
  });

  it('should return a user', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    userRepository.findById.mockResolvedValue(mockUser as any);

    const query = new GetUserQuery('1');
    const result = await handler.execute(query);

    expect(result).toEqual(mockUser);
  });

  it('should throw if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const query = new GetUserQuery('1');
    await expect(handler.execute(query)).rejects.toThrow(UserNotFoundException);
  });
});

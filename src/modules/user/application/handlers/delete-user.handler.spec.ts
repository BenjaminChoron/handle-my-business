import { DeleteUserHandler } from './delete-user.handler';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user.exceptions';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new DeleteUserHandler(userRepository);
  });

  it('should delete a user', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    userRepository.findById.mockResolvedValue(mockUser as any);

    const command = new DeleteUserCommand('1');
    await handler.execute(command);

    expect(userRepository.deleteById).toHaveBeenCalledWith('1');
  });

  it('should throw if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const command = new DeleteUserCommand('1');
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});

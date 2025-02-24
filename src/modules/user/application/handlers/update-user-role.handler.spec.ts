import { UpdateUserRoleHandler } from './update-user-role.handler';
import { UpdateUserRoleCommand } from '../commands/update-user-role.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user.exceptions';
import { UserRole } from '../../domain/entities/user.entity';

describe('UpdateUserRoleHandler', () => {
  let handler: UpdateUserRoleHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new UpdateUserRoleHandler(userRepository);
  });

  it('should update user role', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: UserRole.USER,
      updateRole: jest.fn(),
    };
    userRepository.findById.mockResolvedValue(mockUser as any);

    const command = new UpdateUserRoleCommand('1', UserRole.ADMIN);
    await handler.execute(command);

    expect(mockUser.updateRole).toHaveBeenCalledWith(UserRole.ADMIN);
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should throw if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const command = new UpdateUserRoleCommand('1', UserRole.ADMIN);
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});

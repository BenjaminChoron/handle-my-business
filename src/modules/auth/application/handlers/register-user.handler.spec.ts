import { RegisterUserHandler } from './register-user.handler';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRepository } from '../../../../modules/user/domain/repositories/user.repository';
import { UserAlreadyExistsException } from '../../../../modules/user/domain/exceptions/user.exceptions';

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      deleteById: jest.fn(),
    };

    handler = new RegisterUserHandler(userRepository);
  });

  it('should register a new user', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const command = new RegisterUserCommand('test@example.com', 'Pa$$w0rd!');

    await handler.execute(command);

    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should throw if user already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
    } as any);
    const command = new RegisterUserCommand('test@example.com', 'Pa$$w0rd!');

    await expect(handler.execute(command)).rejects.toThrow(
      UserAlreadyExistsException,
    );
  });
});

import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';

import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { InvalidLoginCredentialsException } from '../../domain/exceptions/auth.exceptions';
import { PasswordHasher } from '../../infrastructure/security/password-hasher';
import { LoginUserCommand } from '../commands/login-user.command';
import { LoginUserHandler } from './login-user.handler';

jest.mock('../../infrastructure/security/password-hasher', () => ({
  PasswordHasher: {
    comparePasswords: jest.fn(),
  },
}));

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [
            () => ({
              jwt: {
                secret: 'test_secret_key',
                expiresIn: '1h',
              },
            }),
          ],
        }),
      ],
      providers: [
        LoginUserHandler,
        {
          provide: 'UserRepository',
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LoginUserHandler>(LoginUserHandler);
    userRepository = module.get('UserRepository');
  });

  it('should login a user and return token', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    };
    userRepository.findByEmail.mockResolvedValue(mockUser as any);
    (PasswordHasher.comparePasswords as jest.Mock).mockResolvedValue(true);

    const command = new LoginUserCommand('test@example.com', 'Pa$$w0rd!');
    const result = await handler.execute(command);

    expect(result).toHaveProperty('accessToken');
  });

  it('should throw if user not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const command = new LoginUserCommand('test@example.com', 'Pa$$w0rd!');

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidLoginCredentialsException,
    );
  });
});

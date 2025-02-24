import { ConfigModule } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { LoginUserDTO } from './dtos/login-user.dto';
import { RegisterUserDTO } from './dtos/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get(CommandBus);
  });

  it('should register a new user', async () => {
    const dto: RegisterUserDTO = {
      email: 'test@example.com',
      password: 'Pa$$w0rd!',
    };

    await controller.register(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        password: dto.password,
      }),
    );
  });

  it('should login a user', async () => {
    const dto: LoginUserDTO = {
      email: 'test@example.com',
      password: 'Pa$$w0rd!',
    };

    const mockToken = { accessToken: 'mock.jwt.token' };
    (commandBus.execute as jest.Mock).mockResolvedValue(mockToken);

    const result = await controller.login(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        password: dto.password,
      }),
    );
    expect(result).toEqual(mockToken);
  });
});

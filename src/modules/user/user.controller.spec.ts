import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../auth/infrastructure/security/auth.guard';

jest.mock('../auth/infrastructure/security/role.guard', () => ({
  RoleGuard: jest.fn().mockImplementation(() => ({
    canActivate: () => true,
  })),
}));

describe('UserController', () => {
  let controller: UserController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it('should list users', async () => {
    const mockUsers = [{ id: '1', email: 'test@example.com' }];
    (queryBus.execute as jest.Mock).mockResolvedValue(mockUsers);

    const result = await controller.listUsers({ page: 1, limit: 10 });

    expect(result).toEqual(mockUsers);
  });

  it('should get a user by id', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (queryBus.execute as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.getUser('1');

    expect(result).toEqual(mockUser);
  });

  it('should update user role', async () => {
    await controller.updateUserRole('1', { role: 'ADMIN' });

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '1',
        role: 'ADMIN',
      }),
    );
  });

  it('should delete a user', async () => {
    await controller.deleteUser('1');

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '1',
      }),
    );
  });
});

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { TypeORMUserEntity } from './infrastructure/persistence/typeorm-user.entity';
import { TypeORMUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { LoginUserHandler } from './application/handlers/login-user.handler';
import { UpdateUserRoleHandler } from './application/handlers/update-user-role.handler';
import { DeleteUserHandler } from './application/handlers/delete-user.handler';
import { ListUsersHandler } from './application/handlers/list-users.handler';
import { GetUserHandler } from './application/handlers/get-user.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TypeORMUserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeORMUserRepository,
    },
    RegisterUserHandler,
    LoginUserHandler,
    ListUsersHandler,
    GetUserHandler,
    UpdateUserRoleHandler,
    DeleteUserHandler,
  ],
})
export class UserModule {}

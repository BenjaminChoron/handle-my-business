import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { TypeORMUserEntity } from './infrastructure/persistence/typeorm-user.entity';
import { TypeORMUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { LoginUserHandler } from './application/handlers/login-user.handler';

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
  ],
})
export class UserModule {}

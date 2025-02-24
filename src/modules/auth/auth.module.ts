import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { LoginUserHandler } from './application/handlers/login-user.handler';
import { TypeORMUserEntity } from '../user/infrastructure/persistence/typeorm-user.entity';
import { TypeORMUserRepository } from '../user/infrastructure/persistence/typeorm-user.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TypeORMUserEntity])],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeORMUserRepository,
    },
    RegisterUserHandler,
    LoginUserHandler,
  ],
})
export class AuthModule {}

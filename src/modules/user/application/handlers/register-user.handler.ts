import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as crypto from 'crypto';
import { UserRole } from '../../domain/entities/user.entity';
import { PasswordHasher } from '../../infrastructure/security/password-hasher';
import { UserAlreadyExistsException } from '../../domain/exceptions/user.exceptions';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: UserRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { email, password } = command;

    const userExists = await this.userRepo.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await PasswordHasher.hashPassword(password);

    const user = new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      UserRole.USER,
      new Date(),
      new Date(),
    );

    await this.userRepo.save(user);
  }
}

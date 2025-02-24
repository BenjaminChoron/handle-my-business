import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import * as crypto from 'crypto';

// Auth
import { RegisterUserCommand } from '../commands/register-user.command';
import { PasswordHasher } from '../../../auth/infrastructure/security/password-hasher';

// User
import { UserRepository } from '../../../user/domain/repositories/user.repository';
import { User } from '../../../user/domain/entities/user.entity';
import { UserRole } from '../../../user/domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../../user/domain/exceptions/user.exceptions';

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

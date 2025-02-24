import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { PasswordHasher } from '../../infrastructure/security/password-hasher';
import {
  InvalidEmailException,
  WeakPasswordException,
} from '../../domain/exceptions/user.exceptions';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    if (command.email.length < 5 || !command.email.includes('@')) {
      throw new InvalidEmailException();
    }

    if (command.password.length < 8) {
      throw new WeakPasswordException();
    }

    const hashedPassword = await PasswordHasher.hashPassword(command.password);

    const user = new User(
      crypto.randomUUID(),
      command.email,
      hashedPassword,
      command.role,
      new Date(),
      new Date(),
    );

    await this.userRepository.save(user);
  }
}

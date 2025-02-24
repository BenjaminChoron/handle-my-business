// src/modules/user/application/handlers/login-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../commands/login-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../infrastructure/security/password-hasher';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { Inject } from '@nestjs/common';
import {
  InvalidLoginCredentialsException,
  JwtExpiresInNotDefinedException,
  JwtSecretNotDefinedException,
} from '../../domain/exceptions/user.exceptions';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {
    this.jwtSecret = process.env.JWT_SECRET ?? '';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '';

    if (!this.jwtSecret) {
      throw new JwtSecretNotDefinedException();
    }

    if (!this.jwtExpiresIn) {
      throw new JwtExpiresInNotDefinedException();
    }
  }

  async execute(command: LoginUserCommand): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidLoginCredentialsException();
    }

    const isPasswordValid = await PasswordHasher.comparePasswords(
      command.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidLoginCredentialsException();
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = JwtService.generateToken(
      payload,
      this.jwtSecret,
      this.jwtExpiresIn,
    );

    return { accessToken };
  }
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './application/commands/register-user.command';
import { LoginUserCommand } from './application/commands/login-user.command';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDTO): Promise<void> {
    await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDTO): Promise<{ accessToken: string }> {
    return this.commandBus.execute(
      new LoginUserCommand(dto.email, dto.password),
    );
  }
}

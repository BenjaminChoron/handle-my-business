import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './application/commands/register-user.command';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { LoginUserCommand } from './application/commands/login-user.command';
import { LoginUserDTO } from './dtos/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async registerUser(@Body() dto: RegisterUserDTO): Promise<void> {
    const { email, password } = dto;
    await this.commandBus.execute(new RegisterUserCommand(email, password));
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDTO): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    return this.commandBus.execute(new LoginUserCommand(email, password));
  }
}

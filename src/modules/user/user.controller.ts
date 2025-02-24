import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './application/commands/register-user.command';
import { RegisterUserDTO } from './dtos/register-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async registerUser(@Body() dto: RegisterUserDTO): Promise<void> {
    const { email, password } = dto;
    await this.commandBus.execute(new RegisterUserCommand(email, password));
  }
}

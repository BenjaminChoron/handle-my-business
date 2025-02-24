import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './application/commands/register-user.command';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { LoginUserCommand } from './application/commands/login-user.command';
import { LoginUserDTO } from './dtos/login-user.dto';
import { RoleGuard } from './infrastructure/security/role.guard';
import { AuthGuard } from './infrastructure/security/auth.guard';
import { ListUsersQuery } from './application/queries/list-users.query';
import { GetUserQuery } from './application/queries/get-user.query';
import { UpdateUserRoleCommand } from './application/commands/update-user-role.command';
import { DeleteUserCommand } from './application/commands/delete-user.command';
import { UserRole } from './domain/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get()
  @UseGuards(AuthGuard, new RoleGuard(UserRole.ADMIN))
  async listUsers(@Query() query: ListUsersQuery): Promise<any[]> {
    return this.queryBus.execute(new ListUsersQuery(query.page, query.limit));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string): Promise<any> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard, new RoleGuard(UserRole.ADMIN))
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
  ): Promise<void> {
    await this.commandBus.execute(new UpdateUserRoleCommand(id, body.role));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, new RoleGuard(UserRole.ADMIN))
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// User
import { ListUsersQuery } from './application/queries/list-users.query';
import { GetUserQuery } from './application/queries/get-user.query';
import { UpdateUserRoleCommand } from './application/commands/update-user-role.command';
import { DeleteUserCommand } from './application/commands/delete-user.command';
import { UserRole } from './domain/entities/user.entity';

// Auth
import { AuthGuard } from '../auth/infrastructure/security/auth.guard';
import { RoleGuard } from '../auth/infrastructure/security/role.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

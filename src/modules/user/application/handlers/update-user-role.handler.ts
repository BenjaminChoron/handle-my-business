import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserRoleCommand } from '../commands/update-user-role.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user.exceptions';
import { UserRole } from '../../domain/entities/user.entity';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler
  implements ICommandHandler<UpdateUserRoleCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    const { userId, role } = command;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    user.updateRole(role as UserRole);
    await this.userRepository.save(user);
  }
}

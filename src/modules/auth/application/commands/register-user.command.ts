import { UserRole } from '../../../../modules/user/domain/entities/user.entity';

export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole = UserRole.USER,
  ) {}
}

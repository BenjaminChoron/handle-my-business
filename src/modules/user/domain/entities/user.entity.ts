export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }
}

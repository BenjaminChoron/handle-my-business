export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public role: string, // Exemple : "user" ou "admin"
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateRole(newRole: string): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }
}

export class Email {
  constructor(private readonly value: string) {
    if (!this.validateEmail(value)) {
      throw new Error('Invalid email address');
    }
  }

  toString(): string {
    return this.value;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }
}

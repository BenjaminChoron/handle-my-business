export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class InvalidEmailException extends Error {
  constructor() {
    super('Invalid email');
    this.name = 'InvalidEmailException';
  }
}

export class WeakPasswordException extends Error {
  constructor() {
    super('Password is too weak');
    this.name = 'WeakPasswordException';
  }
}

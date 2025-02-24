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

export class InvalidLoginCredentialsException extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidLoginCredentialsException';
  }
}

export class JwtSecretNotDefinedException extends Error {
  constructor() {
    super('JWT_SECRET is not defined');
    this.name = 'JwtSecretNotDefinedException';
  }
}

export class JwtExpiresInNotDefinedException extends Error {
  constructor() {
    super('JWT_EXPIRES_IN is not defined');
    this.name = 'JwtExpiresInNotDefinedException';
  }
}

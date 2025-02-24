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

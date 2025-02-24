export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends Error {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsException';
  }
}

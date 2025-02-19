export class ProductNotFoundException extends Error {
  constructor(id: string) {
    super(`Product with id ${id} not found`);
    this.name = 'ProductNotFoundException';
  }
}

export class InvalidProductDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProductDataException';
  }
}

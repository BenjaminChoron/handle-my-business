export class HashedPassword {
  constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }
}

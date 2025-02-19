export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateDetails(
    name: string,
    description: string,
    price: number,
    stock: number,
  ): void {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.updatedAt = new Date();
  }
}

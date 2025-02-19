import { Product } from '../entities/product.entity';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(page: number, limit: number): Promise<Product[]>;
  deleteById(id: string): Promise<void>;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { TypeORMProductEntity } from './typeorm-product.entity';

@Injectable()
export class TypeORMProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(TypeORMProductEntity)
    private readonly productRepo: Repository<TypeORMProductEntity>,
  ) {}

  async save(product: Product): Promise<void> {
    const entity = this.productRepo.create(product);
    await this.productRepo.save(entity);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepo.findOneBy({ id });
    if (!entity) return null;

    return new Product(
      entity.id,
      entity.name,
      entity.description,
      entity.price,
      entity.stock,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    const entities = await this.productRepo.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return entities.map(
      (entity) =>
        new Product(
          entity.id,
          entity.name,
          entity.description,
          entity.price,
          entity.stock,
          entity.createdAt,
          entity.updatedAt,
        ),
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { TypeORMProductEntity } from './typeorm-product.entity';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';

@Injectable()
export class TypeORMProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(TypeORMProductEntity)
    private readonly productRepo: Repository<TypeORMProductEntity>,
  ) {}

  async save(product: Product): Promise<void> {
    try {
      const entity = this.productRepo.create({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });

      await this.productRepo.save(entity);
    } catch (error) {
      throw new Error(
        `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const entity = await this.productRepo.findOneBy({ id });

      if (!entity) {
        return null;
      }

      return new Product(
        entity.id,
        entity.name,
        entity.description,
        entity.price,
        entity.stock,
        entity.createdAt,
        entity.updatedAt,
      );
    } catch (error) {
      throw new Error(
        `Failed to find product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    try {
      const entities = await this.productRepo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
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
    } catch (error) {
      throw new Error(
        `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const result = await this.productRepo.delete(id);

      if (result.affected === 0) {
        throw new ProductNotFoundException(id);
      }
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }

      throw new Error(
        `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

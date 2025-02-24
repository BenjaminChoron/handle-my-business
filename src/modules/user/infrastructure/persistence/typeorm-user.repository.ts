// src/modules/user/infrastructure/persistence/typeorm-user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { TypeORMUserEntity } from './typeorm-user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user.exceptions';

@Injectable()
export class TypeORMUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeORMUserEntity)
    private readonly userRepo: Repository<TypeORMUserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    try {
      const entity = this.userRepo.create({
        id: user.id,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      await this.userRepo.save(entity);
    } catch (error) {
      throw new Error(
        `Failed to save user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.userRepo.findOneBy({ id });
      if (!entity) return null;

      return new User(
        entity.id,
        entity.email,
        entity.password,
        entity.role,
        entity.createdAt,
        entity.updatedAt,
      );
    } catch (error) {
      throw new Error(
        `Failed to find user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.userRepo.findOneBy({ email });
      if (!entity) return null;

      return new User(
        entity.id,
        entity.email,
        entity.password,
        entity.role,
        entity.createdAt,
        entity.updatedAt,
      );
    } catch (error) {
      throw new Error(
        `Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    try {
      const entities = await this.userRepo.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      return entities.map(
        (entity) =>
          new User(
            entity.id,
            entity.email,
            entity.password,
            entity.role,
            entity.createdAt,
            entity.updatedAt,
          ),
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const result = await this.userRepo.delete(id);
      if (result.affected === 0) {
        throw new UserNotFoundException(id);
      }
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

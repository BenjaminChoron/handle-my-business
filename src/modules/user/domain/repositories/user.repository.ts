import { User } from '../entities/user.entity';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<User[]>;
  deleteById(id: string): Promise<void>;
}

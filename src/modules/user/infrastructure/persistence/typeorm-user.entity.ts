import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../domain/entities/user.entity';

@Entity('users')
export class TypeORMUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}

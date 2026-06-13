import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'], default: 'OPEN' })
  status: string;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    eager: true,
    cascade: true,
  })
  items: CartItemEntity[];
}

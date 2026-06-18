import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  cart_id: string;

  @Column({ type: 'jsonb', nullable: true })
  payment: object | null;

  @Column({ type: 'jsonb', nullable: true })
  delivery: object | null;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({
    type: 'enum',
    enum: [
      'OPEN',
      'ORDERED',
      'APPROVED',
      'CONFIRMED',
      'SENT',
      'COMPLETED',
      'CANCELLED',
    ],
    default: 'ORDERED',
  })
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;
}

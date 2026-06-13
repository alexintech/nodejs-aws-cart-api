import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartItemEntity } from '../cart/entities/cart-item.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [CartEntity, CartItemEntity, OrderEntity],
        synchronize: false,
        logging: true,
        ssl: { rejectUnauthorized: false },
      }),
    }),
  ],
})
export class DatabaseModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { CreateOrderPayload, OrderStatus } from '../type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {}

  getAll(): Promise<OrderEntity[]> {
    return this.orderRepo.find();
  }

  findById(orderId: string): Promise<OrderEntity> {
    return this.orderRepo.findOne({ where: { id: orderId } });
  }

  create(data: CreateOrderPayload): Promise<OrderEntity> {
    const entity = this.orderRepo.create({
      user_id: data.userId,
      cart_id: data.cartId,
      payment: null,
      delivery: data.address as unknown as object,
      comments: null,
      status: OrderStatus.Open,
      total: data.total,
    });
    return this.orderRepo.save(entity);
  }

  async update(orderId: string, data: Partial<OrderEntity>): Promise<void> {
    const order = await this.findById(orderId);
    if (!order) {
      throw new Error('Order does not exist.');
    }
    await this.orderRepo.save({ ...order, ...data, id: orderId });
  }
}

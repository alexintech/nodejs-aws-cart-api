import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { Cart, CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';
import { OrderEntity } from 'src/order/entities/order.entity';
import { CreateOrderPayload, OrderStatus } from 'src/order/type';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepo: Repository<CartItemEntity>,
    private dataSource: DataSource,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const entity = await this.cartRepo.findOne({
      where: { user_id: userId, status: CartStatuses.OPEN },
    });
    return entity ? this.toCart(entity) : null;
  }

  async createByUserId(userId: string): Promise<Cart> {
    const entity = this.cartRepo.create({
      user_id: userId,
      status: CartStatuses.OPEN,
    });
    const saved = await this.cartRepo.save(entity);
    return this.toCart(saved);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existing = await this.findByUserId(userId);
    return existing ?? this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    const existing = await this.cartItemRepo.findOne({
      where: { cart_id: cart.id, product_id: payload.product.id },
    });

    if (payload.count === 0) {
      if (existing) {
        await this.cartItemRepo.delete({
          cart_id: cart.id,
          product_id: payload.product.id,
        });
      }
    } else if (existing) {
      await this.cartItemRepo.update(
        { cart_id: cart.id, product_id: payload.product.id },
        { count: payload.count },
      );
    } else {
      await this.cartItemRepo.save(
        this.cartItemRepo.create({
          cart_id: cart.id,
          product_id: payload.product.id,
          count: payload.count,
        }),
      );
    }

    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.cartRepo.findOne({ where: { user_id: userId } });
    if (cart) {
      await this.cartItemRepo.delete({ cart_id: cart.id });
      await this.cartRepo.delete({ id: cart.id });
    }
  }

  async updateStatusByUserId(
    userId: string,
    status: CartStatuses,
  ): Promise<void> {
    await this.cartRepo.update({ user_id: userId }, { status });
  }

  async checkout(data: CreateOrderPayload): Promise<OrderEntity> {
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(OrderEntity, {
        user_id: data.userId,
        cart_id: data.cartId,
        delivery: data.address as unknown as object,
        payment: null,
        comments: null,
        status: OrderStatus.Open,
        total: data.total,
      });
      const savedOrder = await manager.save(OrderEntity, order);
      await manager.update(
        CartEntity,
        { user_id: data.userId },
        { status: CartStatuses.ORDERED },
      );
      return savedOrder;
    });
  }

  private toCart(entity: CartEntity): Cart {
    return {
      id: entity.id,
      user_id: entity.user_id,
      created_at: new Date(entity.created_at).getTime(),
      updated_at: new Date(entity.updated_at).getTime(),
      status: entity.status as CartStatuses,
      items: (entity.items ?? []).map((item) => ({
        product: { id: item.product_id, title: '', description: '', price: 0 },
        count: item.count,
      })),
    };
  }
}

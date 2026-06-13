import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { Cart, CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepo: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const entity = await this.cartRepo.findOne({ where: { user_id: userId } });
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

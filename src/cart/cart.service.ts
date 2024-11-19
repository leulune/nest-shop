import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { CreateCartDto } from './dto/cart.dto';
import { Product } from 'src/products/products.model';
import { User } from 'src/users/users.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private cartRepository: typeof Cart,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async createCart(dto: CreateCartDto) {
    const cart = await this.cartRepository.create(dto);
    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await this.productRepository.findByPk(productId);
    if (!product) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (!product || product.quantity < quantity) {
      throw new HttpException(
        'Недостаточно товара на складе',
        HttpStatus.BAD_REQUEST,
      );
    }

    const totalPrice = product.price * quantity;

    const cartItem = await this.cartRepository.create({
      userId,
      productId,
      productName: product.name,
      quantity,
      totalPrice,
    });

    return cartItem;
  }

  async getCartItems(userId: number) {
    const items = this.cartRepository.findAll({
      where: { userId },
      include: [Product],
    });
    return items;
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.destroy({ where: { userId } });
  }
}

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CartService } from '../cart/cart.service';
import { Response } from 'express';
import { PurchaseService } from 'src/purchase/purchase.service';
import { BonusService } from 'src/bonus/bonus.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private cartService: CartService,
    private purchaseService: PurchaseService,
    private bonusService: BonusService,
  ) {}

  @Post('/create-checkout-session')
  async createCheckoutSession(
    @Body() body: { userId: number; useBonus: boolean },
  ) {
    const { userId, useBonus } = body;

    if (typeof useBonus !== 'boolean') {
      throw new HttpException(
        'Поле useBonus должно быть true или false',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cartItems = await this.cartService.getCartItems(userId);

    if (!cartItems || cartItems.length === 0) {
      throw new HttpException('Корзина пуста', HttpStatus.BAD_REQUEST);
    }

    let totalPrice = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );
    console.log('TOTO before bonuses: ', totalPrice);

    const unitPrice =
      totalPrice / cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('UTO: ', unitPrice);

    if (useBonus) {
      const bonuses = await this.bonusService.getBonuses(userId);
      const totalBonuses = bonuses.reduce(
        (total, bonus) => total + bonus.amount,
        0,
      );
      totalPrice = Math.max(0, totalPrice - totalBonuses);
      console.log('TOTO after bonuses: ', totalPrice);
    }

    // передача товаров в stripe с учетом бонуса: true/false
    const items = cartItems.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      priceInCents: Math.round(
        (totalPrice /
          cartItems.reduce((total, item) => total + item.quantity, 0)) *
          100,
      ),
    }));
    console.log(items);

    // оплата stripe
    const session = await this.stripeService.createCheckoutSession(
      items,
      `${process.env.MY_DOMAIN}/success`,
      `${process.env.MY_DOMAIN}/cancel`,
      userId.toString(),
    );

    console.log('MY_DOMAIN:', process.env.MY_DOMAIN);

    return { url: session.url };
  }

  @Get('/cancel')
  handleCancel(@Res() res: Response): void {
    res.send('Оплата отменена.');
  }

  @Get('all/:userId')
  async getAllPurchases(@Param('userId') userId: number) {
    return this.purchaseService.getPurchaseByUser(userId);
  }
}

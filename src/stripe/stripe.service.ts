import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_CLIENT') stripeClient: Stripe) {
    this.stripe = stripeClient;
  }

  // Stripe Checkout Session (сессия оплаты для юзера) - в конце содержит ссылку для перенаправления и завершения оплаты
  async createCheckoutSession(
    items: any[],
    successUrl: string,
    cancelUrl: string,
    userId: string,
  ) {
    const cartItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const metadata = {
      userId: userId,
      cartItems: JSON.stringify(cartItems),
    };

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'rub', // валюта
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceInCents, // страйп работает с деньгами в мин единицах валюты - центы = копейки
        },
        quantity: item.quantity,
      })),
      mode: 'payment', // тип сессии - покупка
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    });
    return session;
  }

  constructEvent(payload: any, sig: string): any {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // constructEvent - исп для проверки подлинности/верификации (за счет ключа STRIPE_WEBHOOK_SECRET)
    // и обработки вебхуков от страйп (засчет sig)
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }

  async retrieveSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
}

import { DynamicModule, Module, Provider } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { WebhookController } from 'src/webhook/webhook.controller';
import { CartModule } from 'src/cart/cart.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { BonusModule } from 'src/bonus/bonus.module';
import { ProductsModule } from 'src/products/products.module';

@Module({})
export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    if (!apiKey) {
      throw new Error(
        'Stripe API key is missing. Please check your environment variables.',
      );
    }

    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: 'STRIPE_CLIENT',
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider, StripeService],
      exports: [stripeProvider, StripeService],
      controllers: [StripeController, WebhookController],
      imports: [CartModule, PurchaseModule, BonusModule, ProductsModule],
    };
  }
}

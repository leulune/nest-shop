import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { BonusService } from 'src/bonus/bonus.service';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { StripeService } from 'src/stripe/stripe.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private stripeService: StripeService,
    private purchaseService: PurchaseService,
    private cartService: CartService,
    private bonusService: BonusService,
    private productService: ProductsService,
  ) {}

  @Post()
  async handleWebhook(
    @Body() payload: Buffer,
    @Headers('stripe-signature') sig: string,
    @Headers() headers: any,
  ) {
    try {
      this.logger.log(`Received headers: ${JSON.stringify(headers)}`);

      if (!sig) {
        throw new Error('No stripe-signature header value was provided.');
      }
      const event = this.stripeService.constructEvent(payload, sig);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = parseInt(session.metadata.userId, 10);
        const cartItems = await this.cartService.getCartItems(userId);

        this.logger.log(`UserId: ${userId}`);
        this.logger.log('Cart Items: AAA', cartItems);

        if (cartItems && cartItems.length > 0) {
          for (const item of cartItems) {
            try {
              const isBonusProduct = await this.productService.isBonusProduct(
                item.productId,
              );
              if (isBonusProduct) {
                const bonusPercentage =
                  await this.productService.bonusPercentage(item.productId);
                const bonusAmount = Math.round(
                  Number(item.totalPrice) * bonusPercentage,
                );
                this.logger.log(
                  `Adding bonus ${bonusAmount} for productId ${item.productId}`,
                );
                await this.bonusService.addBonus(
                  userId,
                  item.productId,
                  bonusAmount,
                );
              }
              await this.purchaseService.createPurchase({
                userId,
                productId: item.productId,
                purchaseQuantity: item.quantity,
              });
              this.logger.log(
                `Purchase created for productId ${item.productId}`,
              );
              await this.productService.decreaseProduct(
                item.productId,
                item.quantity,
              );
              this.logger.log(
                `Уменьшилось количество товаров с id: ${item.productId} на ${item.quantity}`,
              );
            } catch (error) {
              this.logger.error(
                `Failed to create purchase for productId ${item.productId}: ${error.message}`,
              );
            }
          }
          await this.cartService.clearCart(userId);
          this.logger.log(`Cart cleared for userId ${userId}`);
          await this.bonusService.clearBonuses(userId);
        }
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook Error: ${error.message}`);
      throw new HttpException(
        `Webhook Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

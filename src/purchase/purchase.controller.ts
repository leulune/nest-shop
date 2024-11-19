import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('/purchases')
  async createPurchase(@Body() dto: PurchaseDto) {
    return await this.purchaseService.createPurchase(dto);
  }

  @Post('/addPurchase')
  async addPurchase(
    @Body() body: { userId: number; productId: number; quantity: number },
  ) {
    return await this.purchaseService.addPurchase(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get('all/:userId')
  async getPurchasesByUser(@Param('userId') userId: number) {
    return this.purchaseService.getPurchaseByUser(userId);
  }
}

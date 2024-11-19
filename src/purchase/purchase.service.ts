import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Purchase } from './purchase.model';
import { PurchaseDto } from './dto/purchase.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase) private purchaseRepository: typeof Purchase,
    private productService: ProductsService,
  ) {}

  async createPurchase(dto: PurchaseDto) {
    try {
      const product = await this.productService.getProductById(dto.productId);
      const totalAmount = product.price * dto.purchaseQuantity;

      const purchase = await this.purchaseRepository.create({
        userId: dto.userId,
        productId: dto.productId,
        quantity: dto.purchaseQuantity,
        totalAmount: totalAmount,
      });
      return purchase;
    } catch (error) {
      console.error('Ошибка при создании покупки:', error);
      throw error;
    }
  }

  async getPurchaseByUser(userId: number) {
    return await this.purchaseRepository.findAll({ where: { userId } });
  }

  async addPurchase(userId: number, productId: number, quantity: number) {
    try {
      const purchase = await this.purchaseRepository.create({
        userId,
        productId,
        purchaseQuantity: quantity,
      });
      console.log('Добавлена покупка вручную', purchase);
      return purchase;
    } catch (error) {
      console.error('Ошибка при добавлении покупки вручную: ', error);
      throw error;
    }
  }
}

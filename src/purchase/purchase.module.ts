import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseService } from './purchase.service';
import { Purchase } from './purchase.model';
import { Product } from 'src/products/products.model';
import { User } from 'src/users/users.model';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Purchase, Product, User]),
    ProductsModule,
  ],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}

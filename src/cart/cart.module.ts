import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { Product } from 'src/products/products.model';
import { User } from 'src/users/users.model';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from 'src/roles/roles.module';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart, Product, User]),
    ProductsModule,
    RolesModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [CartService, RolesGuard],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}

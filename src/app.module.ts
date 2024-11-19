import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { RolesController } from './roles/roles.controller';
import { UsersController } from './users/users.controller';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { UserRoles } from './roles/user-roles.model';
import { ShopModule } from './shop/shop.module';
import { ProductsModule } from './products/products.module';
import { Shop } from './shop/shop.model';
import { CartModule } from './cart/cart.module';
import { Product } from './products/products.model';
import { Cart } from './cart/cart.model';
import { StripeService } from './stripe/stripe.service';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';
import { WebhookController } from './webhook/webhook.controller';
import { PurchaseService } from './purchase/purchase.service';
import { PurchaseController } from './purchase/purchase.controller';
import { PurchaseModule } from './purchase/purchase.module';
import { Purchase } from './purchase/purchase.model';
import { BonusService } from './bonus/bonus.service';
import { BonusController } from './bonus/bonus.controller';
import { BonusModule } from './bonus/bonus.module';
import { Bonus } from './bonus/bonus.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Shop, Product, Cart, Purchase, Bonus],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    SequelizeModule.forFeature([
      Role,
      User,
      UserRoles,
      Shop,
      Product,
      Cart,
      Purchase,
      Bonus,
    ]),
    ShopModule,
    ProductsModule,
    CartModule,
    PurchaseModule,
    StripeModule.forRoot(process.env.STRIPE_PRIVATE_KEY, {
      apiVersion: '2024-09-30.acacia',
    }),
    BonusModule,
  ],
  controllers: [
    RolesController,
    UsersController,
    StripeController,
    WebhookController,
    PurchaseController,
    BonusController,
  ],
  providers: [
    RolesService,
    UsersService,
    StripeService,
    PurchaseService,
    BonusService,
  ],
})
export class AppModule {
  constructor() {
    console.log('Loaded STRIPE_PRIVATE_KEY:', process.env.STRIPE_PRIVATE_KEY);
  }
}

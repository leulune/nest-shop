import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './products.model';
import { User } from 'src/users/users.model';
import { RolesModule } from 'src/roles/roles.module';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, User]),
    RolesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [ProductsService, RolesGuard],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

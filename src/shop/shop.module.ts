import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shop } from './shop.model';
import { RolesModule } from 'src/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Shop, User]),
    RolesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [ShopController],
  providers: [ShopService, RolesGuard],
  exports: [ShopService],
})
export class ShopModule {}

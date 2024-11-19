import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Shop } from './shop.model';
import { CreateShopDto } from './dto/shops.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/users.model';
import { CurrentUser } from './user.decorator';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @ApiOperation({ summary: 'Создание магазина' })
  @ApiResponse({ status: 200, type: Shop })
  @Roles('SELLER')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() shopDto: CreateShopDto, @CurrentUser() user: User) {
    shopDto.sellerUserId = user.id;
    return this.shopService.createShop(shopDto, user);
  }

  @ApiOperation({ summary: 'Получить весь список магазинов' })
  @ApiResponse({ status: 200, type: [Shop] })
  @Roles('SELLER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.shopService.getAllShops();
  }
}

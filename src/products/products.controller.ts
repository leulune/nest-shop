import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './dto/products.dto';
import { CurrentUser } from 'src/shop/user.decorator';
import { User } from 'src/users/users.model';
import { Product } from './products.model';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @ApiOperation({ summary: 'Создание товара' })
  @ApiResponse({ status: 200, type: Product })
  @Roles('SELLER')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() productDto: CreateProductDto, @CurrentUser() user: User) {
    return this.productService.createProduct(productDto, user);
  }

  @ApiOperation({ summary: 'Удаление товара' })
  @ApiResponse({ status: 200, type: String })
  @Roles('SELLER')
  @UseGuards(RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.productService.deleteProduct(id, user);
  }

  @ApiOperation({ summary: 'Получить весь список товаров' })
  @ApiResponse({ status: 200, type: [Product] })
  @Roles('SELLER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.productService.getAllProducts();
  }
}

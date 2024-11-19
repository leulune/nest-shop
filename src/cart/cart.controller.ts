import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCartDto } from './dto/cart.dto';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('USER')
  @Post('/add')
  addToCart(@Body() createCartDto: CreateCartDto, @Request() req: any) {
    const user = req.user;
    if (!user) {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }
    createCartDto.userId = user.id;

    return this.cartService.addToCart(
      createCartDto.userId,
      createCartDto.productId,
      createCartDto.quantity,
    );
  }

  @ApiOperation({ summary: 'Получить товары в корзине' })
  @ApiResponse({ status: 200, description: 'Список товаров в корзине' })
  @UseGuards(RolesGuard)
  @Roles('USER')
  @Post('/items')
  async getCartItems(@Request() req: any) {
    const user = req.user;
    if (!user) {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const items = await this.cartService.getCartItems(user.id);
    return items;
  }
}

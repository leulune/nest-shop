import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from './shop.model';
import { CreateShopDto } from './dto/shops.dto';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/users.model';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop) private shopRepository: typeof Shop,
    private roleService: RolesService,
  ) {}

  async createShop(dto: CreateShopDto, user: User) {
    const sellerRole = await this.roleService.getRoleByName('SELLER');
    if (!user.roles.some((role) => role.id === sellerRole.id)) {
      throw new HttpException(
        'Только пользователь с ролью SELLER может создать магазин!',
        HttpStatus.FORBIDDEN,
      );
    }
    const shop = await this.shopRepository.create({
      ...dto,
      sellerUserId: user.id,
    });
    return shop;
  }

  async getAllShops() {
    const shops = await this.shopRepository.findAll({ include: { all: true } });
    return shops;
  }
}

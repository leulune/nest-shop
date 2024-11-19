import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './products.model';
import { CreateProductDto } from './dto/products.dto';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    private roleService: RolesService,
  ) {}

  // Бонусный продукт
  async isBonusProduct(productId: number): Promise<boolean> {
    const product = await this.getProductById(productId);
    return product.isBonusEligible;
  }

  // Возвращает процент бонуса
  async bonusPercentage(productId: number): Promise<number> {
    const product = await this.getProductById(productId);
    return product.isBonusEligible ? 0.15 : 0;
  }

  // добавить товар
  async createProduct(dto: CreateProductDto, user: User) {
    const sellerRole = await this.roleService.getRoleByName('SELLER');

    if (!user.roles.some((role) => role.id === sellerRole.id)) {
      throw new HttpException(
        'Только пользователь с ролью SELLER может добавить товар!',
        HttpStatus.FORBIDDEN,
      );
    }

    const product = await this.productRepository.create(dto);
    return product;
  }

  // удалить товар
  async deleteProduct(productId: number, user: User) {
    const sellerRole = await this.roleService.getRoleByName('SELLER');

    if (!user.roles.some((role) => role.id === sellerRole.id)) {
      throw new HttpException(
        'Только пользователь с ролью SELLER может добавить товар!',
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!result) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.destroy({ where: { id: productId } });
    return {
      message: `Товар успешно удален ${result.name}, ID: ${result.id}`,
      product: result,
    };
  }

  async getAllProducts() {
    const products = await this.productRepository.findAll({
      include: { all: true },
    });
    return products;
  }

  async getProductById(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      include: { all: true },
    });
    return product;
  }

  async decreaseProduct(productId: number, quantity: number) {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    if (product.quantity < quantity) {
      throw new HttpException(
        `Недостаточно товара ${product.name} на складе`,
        HttpStatus.BAD_REQUEST,
      );
    }

    product.quantity -= quantity;
    await product.save();

    return product;
  }
}

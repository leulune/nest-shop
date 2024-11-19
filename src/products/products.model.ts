import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.model';
import { Shop } from 'src/shop/shop.model';

interface ProductCreationAttrs {
  name: string;
  price: number;
  quantity: number;
  unit: string;
  shopId: number;
  isBonusEligible?: boolean;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный иденификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'чай', description: 'Название товара' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 100, description: 'Цена за единицу товара' })
  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @ApiProperty({ example: 10, description: 'Количество товара' })
  @Column({ type: DataType.FLOAT, allowNull: false })
  quantity: number;

  @ApiProperty({ example: 'кг/шт', description: 'Единица измерения товара' })
  @Column({ type: DataType.STRING, allowNull: false })
  unit: string;

  @ApiProperty({ example: true, description: 'Доступность для бонусов' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBonusEligible: boolean;

  @ForeignKey(() => Shop)
  @Column({ type: DataType.INTEGER })
  shopId: number;

  @BelongsTo(() => Shop)
  shop: Shop;

  @HasMany(() => Cart)
  cartItems: Cart[];
}

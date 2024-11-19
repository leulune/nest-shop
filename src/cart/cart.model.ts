import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Product } from 'src/products/products.model';

interface CartCreationAttrs {
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
}

@Table({ tableName: 'cart' })
export class Cart extends Model<Cart, CartCreationAttrs> {
  @ApiProperty({ example: '1', description: 'ID корзины' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'ID пользователя' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ApiProperty({ example: '1', description: 'ID товара' })
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @ApiProperty({ example: 'чай', description: 'наименование товара в корзине' })
  @Column({ type: DataType.STRING, allowNull: false })
  productName: string;

  @ApiProperty({ example: 2, description: 'количество товара в корзине' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @ApiProperty({
    example: 200,
    description: 'общая стоимость товара в корзине',
  })
  @Column({ type: DataType.FLOAT, allowNull: false })
  totalPrice: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}

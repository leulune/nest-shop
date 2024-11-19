import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/products/products.model';
import { User } from 'src/users/users.model';

@Table
export class Purchase extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column
  quantity: number;

  @Column
  totalAmount: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}

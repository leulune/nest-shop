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

interface ShopCreationAttrs {
  name: string;
  description: string;
  sellerUserId: number;
}

@Table({ tableName: 'shops' })
export class Shop extends Model<Shop, ShopCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный иденификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'magazine', description: 'Название магазина' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    example: 'продуктовый/магазин одежды',
    description: 'тип магазина',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  sellerUserId: number;

  @BelongsTo(() => User)
  seller: User;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsInt({ message: 'Должно быть целым числом' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID товара' })
  @IsInt({ message: 'Должно быть целым числом' })
  productId: number;

  @ApiProperty({ example: 'чай', description: 'название товара' })
  @IsString({ message: 'Должно быть строкой' })
  readonly productName: string;

  @ApiProperty({ example: 1, description: 'количество товара в корзине' })
  @IsInt({ message: 'Должно быть целым числом' })
  quantity: number;

  @ApiProperty({
    example: 200.5,
    description: 'общая стоимость товара в корзине',
  })
  @IsNumber({}, { message: 'Общая стоимость должна быть числом' })
  totalPrice: number;
}

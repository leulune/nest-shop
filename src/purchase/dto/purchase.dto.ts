import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PurchaseDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsInt({ message: 'Должно быть целым числом' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID товара' })
  @IsInt({ message: 'Должно быть целым числом' })
  productId: number;

  @ApiProperty({ example: 1, description: 'количество товара при покупке' })
  @IsInt({ message: 'Должно быть целым числом' })
  purchaseQuantity: number;
}

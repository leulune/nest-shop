import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ example: 'magazine', description: 'Название магазина' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;
  @ApiProperty({
    example: 'продуктовый/магазин одежды',
    description: 'тип магазина',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(5, 20, { message: 'Не меньше 5 и не больше 20' })
  readonly description: string;

  @ApiProperty({ example: 1, description: 'ID продавца' })
  @IsInt({ message: 'Должно быть целым числом' })
  sellerUserId: number;
}

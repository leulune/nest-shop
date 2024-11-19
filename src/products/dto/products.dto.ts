import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'виноград', description: 'название продукта' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({ example: 1, description: 'Цена' })
  @IsInt({ message: 'Должно быть целым числом' })
  readonly price: number;

  @ApiProperty({ example: 1, description: 'Количество' })
  @IsInt({ message: 'Должно быть целым числом' })
  readonly quantity: number;

  @ApiProperty({ example: 'кг/шт', description: 'Единица измерения товара' })
  @IsString({ message: 'Должно быть строкой' })
  readonly unit: string;

  @ApiProperty({ example: true, description: 'Доступность для бонусов' })
  @IsBoolean({ message: 'Должен быть булевым значением' })
  isBonusEligible: boolean;

  @ApiProperty({ example: 1, description: 'ID магазина' })
  @IsInt({ message: 'Должно быть целым числом' })
  shopId: number;
}

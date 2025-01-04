import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iPhone 16' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'lorem ipsum dolor sit amet' })
  description: string;

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty({ example: 12345 })
  // price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Apple' })
  brand: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'phone' })
  category: string;
}

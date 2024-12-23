import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { AgreeOfTerm } from '../../agree-of-terms/entities/agree-of-term.entity';
import { CreateAgreeOfTermDto } from '../../agree-of-terms/dto/create-agree-of-term.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'sangwon' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'sangwon@gmail.com' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty({
    description:
      'Has to match a regular expression: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$/',
    example: 'Password123!',
  })
  password: string;

  @ApiProperty({ type: CreateAgreeOfTermDto })
  agree?: AgreeOfTerm;
}

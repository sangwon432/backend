import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreeOfTermDto {
  @ApiProperty({ example: true })
  overTwenty: boolean;

  @ApiProperty({ example: true })
  agreeOfTerm: boolean;

  @ApiProperty({ example: true })
  agreeOfPersonalInfo: boolean;

  @ApiProperty({ example: true })
  agreeOfMarketing: boolean;

  @ApiProperty({ example: true })
  etc: boolean;
}

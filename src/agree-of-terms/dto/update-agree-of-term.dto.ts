import { PartialType } from '@nestjs/swagger';
import { CreateAgreeOfTermDto } from './create-agree-of-term.dto';

export class UpdateAgreeOfTermDto extends PartialType(CreateAgreeOfTermDto) {}

import { Injectable } from '@nestjs/common';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';
import { UpdateAgreeOfTermDto } from './dto/update-agree-of-term.dto';

@Injectable()
export class AgreeOfTermsService {
  create(createAgreeOfTermDto: CreateAgreeOfTermDto) {
    return 'This action adds a new agreeOfTerm';
  }

  findAll() {
    return `This action returns all agreeOfTerms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agreeOfTerm`;
  }

  update(id: number, updateAgreeOfTermDto: UpdateAgreeOfTermDto) {
    return `This action updates a #${id} agreeOfTerm`;
  }

  remove(id: number) {
    return `This action removes a #${id} agreeOfTerm`;
  }
}

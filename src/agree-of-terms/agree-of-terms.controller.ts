import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgreeOfTermsService } from './agree-of-terms.service';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';
import { UpdateAgreeOfTermDto } from './dto/update-agree-of-term.dto';

@Controller('agree-of-terms')
export class AgreeOfTermsController {
  constructor(private readonly agreeOfTermsService: AgreeOfTermsService) {}

  @Post()
  create(@Body() createAgreeOfTermDto: CreateAgreeOfTermDto) {
    return this.agreeOfTermsService.create(createAgreeOfTermDto);
  }

  @Get()
  findAll() {
    return this.agreeOfTermsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agreeOfTermsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgreeOfTermDto: UpdateAgreeOfTermDto) {
    return this.agreeOfTermsService.update(+id, updateAgreeOfTermDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agreeOfTermsService.remove(+id);
  }
}

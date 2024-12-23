import { Test, TestingModule } from '@nestjs/testing';
import { AgreeOfTermsController } from '../agree-of-terms.controller';
import { AgreeOfTermsService } from '../agree-of-terms.service';

describe('AgreeOfTermsController', () => {
  let controller: AgreeOfTermsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreeOfTermsController],
      providers: [AgreeOfTermsService],
    }).compile();

    controller = module.get<AgreeOfTermsController>(AgreeOfTermsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

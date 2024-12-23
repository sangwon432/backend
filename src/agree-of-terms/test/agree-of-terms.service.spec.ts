import { Test, TestingModule } from '@nestjs/testing';
import { AgreeOfTermsService } from '../agree-of-terms.service';

describe('AgreeOfTermsService', () => {
  let service: AgreeOfTermsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgreeOfTermsService],
    }).compile();

    service = module.get<AgreeOfTermsService>(AgreeOfTermsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

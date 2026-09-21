import { Test, TestingModule } from '@nestjs/testing';
import { CausesService } from './causes.service.js';

describe('CausesService', () => {
  let service: CausesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CausesService],
    }).compile();

    service = module.get<CausesService>(CausesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

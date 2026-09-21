import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGiftsService } from './service-gifts.service.js';

describe('ServiceGiftsService', () => {
  let service: ServiceGiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceGiftsService],
    }).compile();

    service = module.get<ServiceGiftsService>(ServiceGiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

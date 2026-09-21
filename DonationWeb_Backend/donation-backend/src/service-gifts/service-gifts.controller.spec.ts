import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGiftsController } from './service-gifts.controller.js';
import { ServiceGiftsService } from './service-gifts.service.js';

describe('ServiceGiftsController', () => {
  let controller: ServiceGiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceGiftsController],
      providers: [ServiceGiftsService],
    }).compile();

    controller = module.get<ServiceGiftsController>(ServiceGiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FaqController } from './faq.controller.js';
import { FaqService } from './faq.service.js';

describe('FaqController', () => {
  let controller: FaqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaqController],
      providers: [FaqService],
    }).compile();

    controller = module.get<FaqController>(FaqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialController } from './testimonial.controller.js';
import { TestimonialService } from './testimonial.service.js';

describe('TestimonialController', () => {
  let controller: TestimonialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonialController],
      providers: [TestimonialService],
    }).compile();

    controller = module.get<TestimonialController>(TestimonialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

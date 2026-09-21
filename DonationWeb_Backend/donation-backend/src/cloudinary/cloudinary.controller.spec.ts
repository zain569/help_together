import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CloudinaryController } from './cloudinary.controller.js';
import { CloudinaryService } from './cloudinary.service.js';

describe('CloudinaryController', () => {
  let controller: CloudinaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinaryController],
      providers: [CloudinaryService],
    }).useMocker((token) => {
      if (token === ConfigService) {
        return {
          getOrThrow: (key: string) => `test-${key}`,
        };
      }
    }).compile();

    controller = module.get<CloudinaryController>(CloudinaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

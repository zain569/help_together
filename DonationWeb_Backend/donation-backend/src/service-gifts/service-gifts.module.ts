import { Module } from '@nestjs/common';
import { ServiceGiftsService } from './service-gifts.service.js';
import { ServiceGiftsController } from './service-gifts.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceGift } from './entities/service-gift.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceGift]),
    AuthModule,
    CloudinaryModule
  ],
  controllers: [ServiceGiftsController],
  providers: [ServiceGiftsService],
})
export class ServiceGiftsModule { }

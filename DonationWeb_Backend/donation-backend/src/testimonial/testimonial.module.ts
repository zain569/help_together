import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service.js';
import { TestimonialController } from './testimonial.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[
    TypeOrmModule.forFeature([Testimonial]),
    AuthModule
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}

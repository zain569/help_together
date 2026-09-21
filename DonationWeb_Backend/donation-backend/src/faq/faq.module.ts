import { Module } from '@nestjs/common';
import { FaqService } from './faq.service.js';
import { FaqController } from './faq.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[
    TypeOrmModule.forFeature([Faq]),
    AuthModule
  ],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}

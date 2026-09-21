import { Module } from '@nestjs/common';
import { CausesService } from './causes.service.js';
import { CausesController } from './causes.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauseEntity } from './entities/cause.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CauseEntity]),
    AuthModule,
    CloudinaryModule
  ],
  controllers: [CausesController],
  providers: [CausesService],
})
export class CausesModule { }

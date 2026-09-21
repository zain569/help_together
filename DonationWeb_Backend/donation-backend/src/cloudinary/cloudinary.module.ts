import { forwardRef, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { CloudinaryController } from './cloudinary.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[forwardRef(() => AuthModule)],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports:[CloudinaryService]
})
export class CloudinaryModule {}

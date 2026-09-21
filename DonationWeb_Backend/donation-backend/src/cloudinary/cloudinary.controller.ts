import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    return this.cloudinaryService.uploadImage(file);
  }
}

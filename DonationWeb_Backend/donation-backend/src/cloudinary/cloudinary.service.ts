import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET')
    });
  }
  async uploadImage(file: Express.Multer.File) {
    return new Promise((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'help-together',
          resource_type: 'image'
        },
        (err, result) => {
          if (err) {
            rej(err);
          } else {
            res(result)
          }
        }
      )

      uploadStream.end(file.buffer)
    });
  }
}

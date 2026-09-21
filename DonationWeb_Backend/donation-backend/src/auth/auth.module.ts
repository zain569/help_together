import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { LoginAuthService, ProfileAuthService, RegisterUserService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module.js';
import { AuthGuard } from './guards/auth.guard.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  exports:[AuthGuard, JwtModule],
  imports:[
    UserModule,
    forwardRef(() => CloudinaryModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '3d',
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [RegisterUserService, LoginAuthService, ProfileAuthService, AuthGuard]
})
export class AuthModule {}

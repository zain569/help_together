import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import {RegisterUserService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterService } from '../user/user.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports:[
    UserModule,
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
  providers: [RegisterUserService]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../user/user.entity.js';

@Module({
  imports:[
    TypeOrmModule.forFeature([ContactEntity, User]),
    AuthModule
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}

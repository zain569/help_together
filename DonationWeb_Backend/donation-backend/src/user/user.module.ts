import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { LoginService, ProfileService, RegisterService } from './user.service.js';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[RegisterService, LoginService, ProfileService],
    exports:[RegisterService, LoginService, ProfileService]
})
export class UserModule {}
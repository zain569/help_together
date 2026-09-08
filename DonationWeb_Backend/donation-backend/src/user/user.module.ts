import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { RegisterService } from './user.service.js';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[RegisterService],
    exports:[RegisterService]
})
export class UserModule {}

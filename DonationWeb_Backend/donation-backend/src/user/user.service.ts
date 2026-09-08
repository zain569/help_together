import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto.js';

@Injectable()
export class RegisterService {
    constructor(@InjectRepository(User)
    private readonly userRepositry: Repository<User>) { }

    async findByEmail(email: string){
        return await this.userRepositry.findOne({
            where: {
                email: email
            }
        })
    }

    async createUser(registerdto: RegisterDto){
        const user = this.userRepositry.create(registerdto);

        const savedUser = await this.userRepositry.save(user);
        return{
            user: savedUser
        }
    }
}

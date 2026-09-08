import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { ConfigService } from '@nestjs/config';
import { RegisterService } from '../user/user.service.js';
import bcrypt from 'bcrypt'

@Injectable()
export class RegisterUserService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService, private readonly registerService: RegisterService) { }
    async RegisterUser(registerdto: RegisterDto) {
        const secret = this.configService.get<string>('JWT_SECRET');

        //Check Email Exist
        const emailExist = await this.registerService.findByEmail(registerdto.email);

        if (emailExist) {
            return {
                message: "The email you enter is also Exist",
                email: registerdto.email
            }
        }

        //bcrypt password
        const saltround = 10;
        const hash = await bcrypt.hash(registerdto.password, saltround);

        //create User
        const result = await this.registerService.createUser({ ...registerdto, password: hash });

        //generate JWT token
        const payload = {
            sub: result.user.id,
            email: result.user.email,
            role: result.user.role,
        };
        const token = this.jwtService.sign(payload, { secret });

        return{
            token: token,
            user: result
        }
    }
}

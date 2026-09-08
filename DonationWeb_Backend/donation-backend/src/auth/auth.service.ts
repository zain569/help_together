import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterUserService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService){}
    async RegisterUser(registerdto: RegisterDto){
        const secret = this.configService.get<string>('JWT_SECRET');
        const payload = { email: registerdto.email, role: registerdto.role };
        const token = this.jwtService.sign(payload, { secret });
        return { token, registerdto };
    }
}

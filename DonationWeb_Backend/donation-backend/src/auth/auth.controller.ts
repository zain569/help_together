import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterUserService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly registerUser: RegisterUserService){}
    @Post('register')
    register(@Body() registerdto: RegisterDto){
        return this.registerUser.RegisterUser(registerdto)
    }
}

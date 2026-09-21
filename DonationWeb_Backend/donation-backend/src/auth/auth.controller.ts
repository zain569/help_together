import { Body, Controller, Get, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginAuthService, ProfileAuthService, RegisterUserService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly registerUser: RegisterUserService,
        private readonly loginUser: LoginAuthService,
        private readonly ProfileUser: ProfileAuthService,
    ) { }
    @Post('register')
    @UseInterceptors(FileInterceptor('image'))
    async register(
        @Body() registerdto: RegisterDto,
        @UploadedFile() image: Express.Multer.File,
        @Response({ passthrough: true }) res: any
    ) {
        const result = await this.registerUser.RegisterUser(registerdto, image);

        if (result.token) {
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/"
            })
        }

        return result;
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Response({ passthrough: true }) res: any,
    ) {
        const result = await this.loginUser.LoginUser(loginDto);

        if (result.token) {
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        return result;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const id = req.user.id;

        const user = await this.ProfileUser.getUserProfile(id);

        return {
            ...user,
            isUser: true
        }
    }
}
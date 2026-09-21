import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { ConfigService } from '@nestjs/config';
import { LoginService, ProfileService, RegisterService } from '../user/user.service.js';
import bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class RegisterUserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly registerService: RegisterService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }
    async RegisterUser(registerdto: RegisterDto, image: Express.Multer.File) {
        const secret = this.configService.get<string>('JWT_SECRET');

        //Check Email Exist
        const emailExist = await this.registerService.findByEmail(registerdto.email);

        if (emailExist) {
            return {
                message: "The email you enter is also Exist",
                email: registerdto.email
            }
        }

        let profileimage = 'https://res.cloudinary.com/dkgeren05/image/upload/v1789876344/default-donation-website-pic_rymjog.png'

        if (image) {
            const result: any = await this.cloudinaryService.uploadImage(image);

            profileimage = result.secure_url
        }

        //bcrypt password
        const saltround = 10;
        const hash = await bcrypt.hash(registerdto.password, saltround);

        //create User
        const result = await this.registerService.createUser({
            ...registerdto,
            password: hash,
            profileimage,
        });

        //generate JWT token
        const payload = {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
        };
        const token = this.jwtService.sign(payload, { secret });

        return {
            token: token,
            user: (({ password: _password, ...user }) => user)(result.user)
        }
    }
}

@Injectable()
export class LoginAuthService {
    constructor(private readonly loginService: LoginService, private readonly jwtService: JwtService) { }

    async LoginUser(loginDto: LoginDto) {
        const user = await this.loginService.findEmail(loginDto.email);

        if (!user) {
            return {
                message: "Email or Password is Incorrect"
            }
        }

        const hashedPassword = user.password;
        const isPasswordMatch = await bcrypt.compare(loginDto.password, hashedPassword);

        if (!isPasswordMatch) {
            return {
                message: "Email or Password is Incorrect"
            }
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                fname: user.firstname,
                lname: user.lastname,
                role: user.role,
                imageurl: user.profileimage,
            },
            token: token
        }
    }
}

@Injectable()
export class ProfileAuthService {
    constructor(private readonly profileService: ProfileService) { }

    async getUserProfile(id: string) {
        const user = await this.profileService.findProfile(id);

        return {
            user
        }
    }
}
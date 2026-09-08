import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../user/user.entity.js";

export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsIn(['user', 'admin', 'organization'])
    role: UserRole;

    @IsOptional()
    @IsString()
    token: string;
}
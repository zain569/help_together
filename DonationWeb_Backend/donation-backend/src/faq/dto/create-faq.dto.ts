import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateFaqDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}

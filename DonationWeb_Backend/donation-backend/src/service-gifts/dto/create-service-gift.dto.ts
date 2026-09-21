import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateServiceGiftDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsBoolean()
    @Transform(({ value }) => value === true || value === 'true')
    isActive: boolean;

    @IsOptional()
    @IsString()
    imageUrl: string;
}

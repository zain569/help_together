import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateCauseDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    @Type(() => Number)
    displayOrder: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === true || value === 'true')
    isActive: boolean;
}

import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class CreateDonationDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    campaignId?: string;

    @IsOptional()
    @IsUUID()
    serviceGiftId?: string;
}

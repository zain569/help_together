import { IsIn, IsString } from 'class-validator';

export class UpdateDonationDto {
    @IsString()
    @IsIn(['PENDING', 'SUCCEEDED', 'FAILED'], {
        message: 'Invalid payment status. Allowed values are PENDING, SUCCEEDED, or FAILED.',
    })
    paymentStatus: string;
}
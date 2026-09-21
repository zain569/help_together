import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceGiftDto } from './create-service-gift.dto.js';

export class UpdateServiceGiftDto extends PartialType(CreateServiceGiftDto) {}

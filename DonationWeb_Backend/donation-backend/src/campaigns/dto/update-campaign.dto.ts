import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDto } from './create-campaign.dto.js';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

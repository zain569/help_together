import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service.js';
import { CampaignsController } from './campaigns.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from './entities/campaign.entity.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity]),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule { }

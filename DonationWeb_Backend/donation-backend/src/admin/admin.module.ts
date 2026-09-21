import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { User } from '../user/user.entity.js';
import { DonationEntity } from '../donation/entities/donation.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity, User, DonationEntity]),
    AuthModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }

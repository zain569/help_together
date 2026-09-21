import { Injectable } from '@nestjs/common';
import { DonationEntity, PaymentStatus } from '../donation/entities/donation.entity.js';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRep: Repository<DonationEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>,

    @InjectRepository(CampaignEntity)
    private readonly campaignRep: Repository<CampaignEntity>,
  ) { }
  async adminDashboard() {
    //Total Donation Count

    const totalDonations = await this.donationRep.count({
      where: {
        paymentStatus: PaymentStatus.SUCCEEDED,
      }
    });

    //total collected amount

    const result = await this.donationRep
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getRawOne();

    const collectedAmnount = Number(result.total) || 0;

    //total users

    const totalUser = await this.userRep.count();

    //users who donated

    const usersWhoDonated = await this.donationRep
      .createQueryBuilder('donation')
      .select('COUNT(DISTINCT donation.userId)', 'count')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getRawOne();

    //last 5 donations

    const latestDonations = await this.donationRep.find({
      where: {
        paymentStatus: PaymentStatus.SUCCEEDED
      },
      relations: {
        campaign: true,
        user: true,
      },
      order: {
        createdAt: "DESC"
      },
      take: 5,
    });

    const donationsWithoutPasswords = latestDonations.map((donation) => ({
      ...donation,
      user: donation.user
        ? (({ password: _password, ...user }) => user)(donation.user)
        : donation.user,
    }));

    //latest 5 campaigns

    const latestCampaign = await this.campaignRep.find({
      order: {
        createdAt: "DESC",
      },
      take: 5,
    });


    return {
      totalDonations,
      collectedAmnount,
      totalUser,
      usersWhoDonated: Number(usersWhoDonated.count) || 0,
      latestDonations: donationsWithoutPasswords,
      latestCampaign,
    };
  }
}

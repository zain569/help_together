import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity, PaymentMethod, PaymentStatus } from './entities/donation.entity.js';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';
import { UserRole } from '../user/user.entity.js';
import { StripeService } from '../stripe/stripe.service.js';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRep: Repository<DonationEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>,

    @InjectRepository(CampaignEntity)
    private readonly campaignRep: Repository<CampaignEntity>,

    @InjectRepository(ServiceGift)
    private readonly SerGifRep: Repository<ServiceGift>,

    private readonly stripeService: StripeService
  ) { }
  async create(createDonationDto: CreateDonationDto, authenticatedUserId: string, authenticatedUserRole: UserRole) {
    const {
      userId,
      campaignId,
      serviceGiftId,
      amount,
    } = createDonationDto;

    // Find user
    const user = await this.userRep.findOne({
      where: {
        id: authenticatedUserRole === UserRole.ADMIN ? userId : authenticatedUserId,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    // Find campaign if campaignId was provided
    let campaign = null;

    if (campaignId) {
      campaign = await this.campaignRep.findOne({
        where: {
          id: campaignId,
        },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign Not Found');
      }
    }

    // Find service gift if serviceGiftId was provided
    let serviceGift = null;

    if (serviceGiftId) {
      serviceGift = await this.SerGifRep.findOne({
        where: {
          id: serviceGiftId,
        },
      });

      if (!serviceGift) {
        throw new NotFoundException('Service Gift Not Found');
      }
    }
    // Donation must have at least campaign OR service
    if (!campaignId && !serviceGiftId) {
      throw new BadRequestException(
        'Donation must have a campaign or service gift',
      );
    }

    //Create Pending Donation

    const donation = this.donationRep.create({
      amount,
      currency: 'PKR',
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.STRIPE,
      user,
      campaign: campaign ?? undefined,
      serviceGift: serviceGift ?? undefined
    })

    const savedDonation = await this.donationRep.save(donation);

    //Create Stripe Payment

    const session = await this.stripeService.createCheckoutSession(
      Number(amount),
      savedDonation.id
    );

    //Add stripe session ID

    savedDonation.stripeSessionId = session.sessionId;

    await this.donationRep.save(savedDonation);

    return {
      message: 'Donation created. Complete payment through Stripe.',
      donationId: savedDonation.id,
      amount: savedDonation.amount,
      currency: savedDonation.currency,
      paymentStatus: savedDonation.paymentStatus,
      paymentMethod: savedDonation.paymentMethod,
      checkoutUrl: session.checkoutUrl,
    }
  }

  findAll() {
    const donations = this.donationRep.find();
    return donations;
  }

  async myDonations(id: string) {

    const user = await this.donationRep.find({
      where: {
        user: {
          id: id
        },
      },
      relations: {
        campaign: true,
        serviceGift: true
      }
    });
    return user;
  }

  //--------------------
  // Stripe Pyment Succeeded
  //--------------------

  async markAsSucceeded(
    donationId: string,
    paymentIntentId: string,
  ) {
    const donation = await this.donationRep.findOne({
      where: {
        id: donationId
      },

      relations: {
        campaign: true,
        serviceGift: true,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation Not Found',);
    };

    //PREVENT DUPLICATE WEBHOOK

    if (donation.paymentStatus === PaymentStatus.SUCCEEDED) {
      return donation;
    };

    //UPDATE PAYMENT STATUS

    donation.paymentStatus = PaymentStatus.SUCCEEDED;

    donation.stripePaymentIntentId = paymentIntentId;

    await this.donationRep.save(donation);

    if (donation.campaign) {
      const campaign = await this.campaignRep.findOne({
        where: {
          id: donation.campaign.id,
        },
      });

      if (campaign) {
        const donationAmount = Number(donation.amount);

        campaign.collectedAmount = Number(campaign.collectedAmount) + donationAmount;

        campaign.remainingAmount = Number(campaign.goalAmount) - Number(campaign.collectedAmount);

        if (campaign.remainingAmount < 0) {
          campaign.remainingAmount = 0;
        };

        await this.campaignRep.save(campaign);
      }
    }
  };

  async markAsFailed(donatiionId: string) {
    const donation = await this.donationRep.findOne({
      where: {
        id: donatiionId,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation Not Found');
    };

    if (donation.paymentStatus === PaymentStatus.SUCCEEDED) {
      return donation;
    };

    donation.paymentStatus = PaymentStatus.FAILED;

    return await this.donationRep.save(donation);
  }

  async findOne(id: string, authenticatedUserId: string, authenticatedUserRole: UserRole) {
    const donation = await this.donationRep.findOne({
      where: authenticatedUserRole === UserRole.ADMIN
        ? { id }
        : { id, user: { id: authenticatedUserId } },
      relations: {
        user: true,
        campaign: true,
        serviceGift: true
      }
    });

    if (!donation) {
      throw new NotFoundException("Donation Not Found");
    }

    return donation
  }

  async remove(id: string) {
    const donation = await this.donationRep.findOne({
      where: {
        id: String(id)
      }
    });

    if (!donation) {
      throw new NotFoundException(`Donation with this ${id} not found`)
    };

    await this.donationRep.delete(id)
    return {
      message: `campaign on ${id} is Deleted Successsfully`,
    };
  }
}

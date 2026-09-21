import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CampaignEntity, CampaignStatus } from './entities/campaign.entity.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly compainRep: Repository<CampaignEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  async create(createCampaignDto: CreateCampaignDto, image: Express.Multer.File) {
    let imageUrl = null;

    if (image) {
      const result: any = await this.cloudinaryService.uploadImage(image);
      imageUrl = result.secure_url
    }
    const { causeId, ...campaignData } = createCampaignDto;
    const campaign = this.compainRep.create({
      ...campaignData,
      imageUrl,
      cause: { id: causeId },
      collectedAmount: 0,
      remainingAmount: createCampaignDto.goalAmount,
    });

    const savedCampaign = await this.compainRep.save(campaign)
    return {
      campaign: savedCampaign
    };
  }

  async findAll(page: number, limit: number) {
    const [campaigns, total] = await this.compainRep.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    });
    return {
      campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const campaign = await this.compainRep.findOne({ where: { id: id } });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} is not found`);
    }

    return { campaign };
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.compainRep.findOne({
      where: {
        id: id
      }
    })

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} is not found`)
    }

    Object.assign(campaign, updateCampaignDto);

    if (updateCampaignDto.goalAmount !== undefined) {
      campaign.remainingAmount = Math.max(
        Number(updateCampaignDto.goalAmount) - Number(campaign.collectedAmount),
        0,
      );
    }

    const savedCampaign = await this.compainRep.save(campaign);
    return savedCampaign;
  }

  async remove(id: string) {
    const campaign = await this.compainRep.findOne({
      where: { id: String(id) },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    await this.compainRep.delete(id);

    return {
      message: 'Campaign deleted successfully',
      id,
      title: campaign.title,
    };
  }

  async searchByTitle(title: string) {
    const campaigns = await this.compainRep.find({
      where: {
        title: ILike(`%${title}%`)
      }
    })
    return { campaigns };
  }

  async findByStatus(status: CampaignStatus) {
    return await this.compainRep.find({
      where: {
        status,
      },
    });
  }

  async filterCampaigns(
    causeId?: string,
    status?: string,
    zakatEligible?: boolean,
    urgent?: boolean,
  ) {
    const query = this.compainRep
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.cause', 'cause');

    if (causeId) {
      query.andWhere('cause.id = :causeId', {
        causeId,
      });
    }

    if (status) {
      query.andWhere('campaign.status = :status', {
        status,
      });
    }

    if (zakatEligible !== undefined) {
      query.andWhere('campaign.zakatEligible = :zakatEligible', {
        zakatEligible,
      });
    }

    if (urgent !== undefined) {
      query.andWhere('campaign.urgent = :urgent', {
        urgent,
      });
    }

    return await query.getMany();
  }

  async publish(id: string) {

    const campaign = await this.compainRep.findOne({
      where: {
        id,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign Not Found');
    }

    campaign.status = CampaignStatus.PUBLISHED;

    return await this.compainRep.save(campaign);
  }

  async archive(id: string) {

    const campaign = await this.compainRep.findOne({
      where: {
        id,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign Not Found');
    }

    campaign.status = CampaignStatus.ARCHIVED;

    return await this.compainRep.save(campaign);
  }
}

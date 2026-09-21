import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceGiftDto } from './dto/create-service-gift.dto.js';
import { UpdateServiceGiftDto } from './dto/update-service-gift.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceGift } from './entities/service-gift.entity.js';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class ServiceGiftsService {
  constructor(
    @InjectRepository(ServiceGift)
    private readonly SerGifRep: Repository<ServiceGift>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  async create(createServiceGiftDto: CreateServiceGiftDto, image: Express.Multer.File) {
    let imageUrl = createServiceGiftDto.imageUrl;

    if (image) {
      const result: any = await this.cloudinaryService.uploadImage(image);
      imageUrl = result.secure_url;
    }

    const gift = this.SerGifRep.create({ ...createServiceGiftDto, imageUrl })
    const savedGift = await this.SerGifRep.save(gift)
    return savedGift;
  }

  async findAll() {
    const gifts = await this.SerGifRep.find({
      where: {
        isActive: true
      }
    })
    return gifts;
  }

  async findAllByadmin() {
    const gifts = await this.SerGifRep.find()
    return gifts;
  }

  async findOne(id: string) {
    const onegift = await this.SerGifRep.findOneBy({ id });
    if (!onegift) {
      throw new NotFoundException(`There is no Gift on this ID "${id}"`)
    }
    return onegift;
  }

  async update(id: string, updateServiceGiftDto: UpdateServiceGiftDto) {
    const gift = await this.SerGifRep.findOne({
      where: {
        id: id
      }
    });

    if (!gift) {
      throw new NotFoundException(`Gift & Service on this ${id} not exist`)
    }
    Object.assign(gift, updateServiceGiftDto);
    return await this.SerGifRep.save(gift);
  }

  async remove(id: string) {
    const gift = await this.SerGifRep.findOne({
      where: {
        id: id
      }
    });

    if (!gift) {
      throw new NotFoundException(`There is no gift And Cause on this ${id}`)
    };

    await this.SerGifRep.remove(gift);
    return {
      message: "The Gift & Cause Removed Successfully",
      title: gift.name
    };
  }
}

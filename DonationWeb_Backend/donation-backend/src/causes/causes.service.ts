import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCauseDto } from './dto/create-cause.dto.js';
import { UpdateCauseDto } from './dto/update-cause.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CauseEntity } from './entities/cause.entity.js';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class CausesService {
  constructor(
    @InjectRepository(CauseEntity)
    private readonly causeRep: Repository<CauseEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  //Create Cause
  async create(createCauseDto: CreateCauseDto, image: Express.Multer.File) {
    let imageUrl = createCauseDto.imageUrl;

    if (image) {
      const result: any = await this.cloudinaryService.uploadImage(image);
      imageUrl = result.secure_url;
    }

    const cause = this.causeRep.create({ ...createCauseDto, imageUrl });

    return await this.causeRep.save(cause);
  }

  //Get All Causes
  async findAll() {
    const causes = await this.causeRep.find({
      where: {
        isActive: true,
      },
      order: {
        displayOrder: 'ASC'
      }
    })
    return causes;
  }

  //Get A Specific Cause
  async findOne(id: string) {
    const cause = await this.causeRep.findOne({
      where: {
        id: id
      }
    })

    if (!cause) {
      throw new NotFoundException('Cause Not Found')
    }
    return cause;
  }

  //Update A Cause
  async update(id: string, updateCauseDto: UpdateCauseDto) {
    const cause = await this.findOne(id);

    Object.assign(cause, updateCauseDto);

    return await this.causeRep.save(cause);
  }

  //Remove a Specific Cause
  async remove(id: string) {
    const cause = await this.findOne(id);

    await this.causeRep.remove(cause);
    return `Cause "${cause.name}" deleted successfully`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto.js';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRep: Repository<Testimonial>,
  ) { }
  async create(createTestimonialDto: CreateTestimonialDto) {
    const testimonial = await this.testimonialRep.create(createTestimonialDto);

    const savedtestimonial = await this.testimonialRep.save(testimonial)
    return savedtestimonial;
  }

  async findAll() {
    return await this.testimonialRep.find({
      where: {
        isActive: true
      },
      order: {
        id: 'DESC'
      }
    });
  }

  async findAllByAdmin() {
    return await this.testimonialRep.find({
      order: {
        id: 'DESC'
      }
    });
  }

  async findOne(id: string) {
    const testimonial = await this.testimonialRep.findOne({
      where: {
        id: id
      }
    });

    if (!testimonial) {
      throw new NotFoundException(`There is no Testimonial ON this ID "${id}"`)
    };

    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    const testimonial = await this.testimonialRep.findOne({
      where: {
        id: id
      }
    });

    if (!testimonial) {
      throw new NotFoundException(`There is no Testimonial ON this ID "${id}"`)
    };

    Object.assign(testimonial, updateTestimonialDto);
    return await this.testimonialRep.save(testimonial);
  }

  async remove(id: string) {
    const testimonial = await this.testimonialRep.findOne({
      where: {
        id: id
      }
    });

    if (!testimonial) {
      throw new NotFoundException(`There is no Testimonial ON this ID "${id}"`)
    };

    await this.testimonialRep.delete(id);
    return {
      message: "Testimonial is deleted successfully",
      onName: testimonial.name
    };
  }
}

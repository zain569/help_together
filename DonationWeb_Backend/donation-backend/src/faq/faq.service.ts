import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto.js';
import { UpdateFaqDto } from './dto/update-faq.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRep: Repository<Faq>
  ) { }
  async create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRep.create(createFaqDto);

    const savedFaq = await this.faqRep.save(faq)
    return savedFaq;
  }

  async findAll() {
    const faqs = await this.faqRep.find({
      where: {
        isActive: true
      },
      order: {
        displayOver: 'ASC'
      }
    });
    return faqs;
  }

  async findOne(id: string) {
    const faq = await this.faqRep.findOne({
      where: {
        id: id
      }
    });

    if (!faq) {
      throw new NotFoundException(`There is no FAQ'S on This ID: "${id}"`);
    }

    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRep.findOne({
      where: {
        id: id
      },
    });

    if (!faq) {
      throw new NotFoundException(`There is no FAQ'S on This ID: "${id}"`)
    };

    Object.assign(faq, updateFaqDto);

    return await this.faqRep.save(faq);;
  }

  async remove(id: string) {
    const faq = await this.faqRep.findOne({
      where: {
        id: id
      },
    });

    if (!faq) {
      throw new NotFoundException(`There is no FAQ'S on This ID: "${id}"`)
    };

    const deletedFAQ = await this.faqRep.delete({ id: id });
    return {
      message: `The FAQ on ID:"${id}" is deleted successfully`,
      question: faq.question
    };
  }

  async findAllByAdmin() {
    const faqs = await this.faqRep.find({
      order: {
        displayOver: 'ASC'
      }
    });
    return faqs;
  }
}

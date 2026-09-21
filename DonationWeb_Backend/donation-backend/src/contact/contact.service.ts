import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity.js';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { User, UserRole } from '../user/user.entity.js';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contRep: Repository<ContactEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>
  ) { }


  async submit(createContactDto: CreateContactDto, authenticatedUserId: string) {
    const user = await this.userRep.findOne({
      where: {
        id: authenticatedUserId
      }
    });

    if (!user) {
      throw new NotFoundException(`There is no User in this ID"${authenticatedUserId}"`)
    }
    const contact = this.contRep.create({
      ...createContactDto,
      userId: authenticatedUserId,
    });

    const savedContact = await this.contRep.save(contact);
    return savedContact;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const contacts = await this.contRep.find();

    return contacts;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(id: string) {
    const contact = await this.contRep.findOne({
      where: {
        id: id
      }
    });

    if (!contact) {
      throw new NotFoundException(`There is no Contact on this ID: "${id}"`)
    };

    return contact;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contRep.findOne({
      where: {
        id,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact Not Found');
    }

    Object.assign(contact, updateContactDto);

    return await this.contRep.save(contact);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(id: string) {
    const contact = await this.contRep.findOne({
      where: {
        id: id
      }
    });

    if (!contact) {
      throw new NotFoundException(`There is no Contact on this ID: "${id}"`)
    };

    await this.contRep.delete(id)
    return {
      message: `Contact with ID: "${id}" was deleted successfully`,
      contact: contact.subject,
    };
  }

  async mycontacts(userId: string) {
    const contacts = await this.contRep.find({
      where: {
        userId: userId
      }
    });
    return contacts;
  }
}

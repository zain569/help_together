import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ContactService } from './contact.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { UserRole } from '../user/user.entity.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  submit(@Body() createContactDto: CreateContactDto, @Req() request: Request) {
    const user = (request as Request & { user: { id: string } }).user;
    return this.contactService.submit(createContactDto, user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('mycontacts/:userId')
  mycontacts(@Req() request: Request) {
    const user = (request as Request & { user: { id: string } }).user;
    return this.contactService.mycontacts(user.id);
  }
}

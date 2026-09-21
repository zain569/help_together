import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service.js';
import { CreateFaqDto } from './dto/create-faq.dto.js';
import { UpdateFaqDto } from './dto/update-faq.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('get-all-faqs-by-admin')
  findAllByAdmin() {
    return this.faqService.findAllByAdmin();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}

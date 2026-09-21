import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialService } from './testimonial.service.js';
import { CreateTestimonialDto } from './dto/create-testimonial.dto.js';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(createTestimonialDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get()
  findAll() {
    return this.testimonialService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('get-all-testmonial-by-admin')
  findAllByAdmin() {
    return this.testimonialService.findAllByAdmin()
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialService.update(id, updateTestimonialDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}

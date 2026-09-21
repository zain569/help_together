import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CausesService } from './causes.service.js';
import { CreateCauseDto } from './dto/create-cause.dto.js';
import { UpdateCauseDto } from './dto/update-cause.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';

@Controller('causes')
export class CausesController {
  constructor(private readonly causesService: CausesService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCauseDto: CreateCauseDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.causesService.create(createCauseDto, image);
  }

  @Get()
  findAll() {
    return this.causesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.causesService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCauseDto: UpdateCauseDto) {
    return this.causesService.update(id, updateCauseDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.causesService.remove(id);
  }
}

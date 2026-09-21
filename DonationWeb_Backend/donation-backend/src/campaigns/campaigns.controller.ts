import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CampaignsService } from './campaigns.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';
import { CampaignStatus } from './entities/campaign.entity.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCampaignDto: CreateCampaignDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.campaignsService.create(createCampaignDto, image);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(limitNumber) || limitNumber < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.campaignsService.findAll(pageNumber, limitNumber);
  }

  @Get('search')
  searchByTitle(@Query('title') title: string) {
    return this.campaignsService.searchByTitle(title);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: CampaignStatus) {
    return this.campaignsService.findByStatus(status);
  }

  @Get('filter')
  filterCampaigns(
    @Query('causeId') causeId?: string,
    @Query('status') status?: string,
    @Query('zakatEligible') zakatEligible?: string,
    @Query('urgent') urgent?: string,
  ) {
    return this.campaignsService.filterCampaigns(
      causeId,
      status,
      zakatEligible === undefined
        ? undefined
        : zakatEligible === 'true',

      urgent === undefined
        ? undefined
        : urgent === 'true',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Patch('publish/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  publish(@Param('id') id: string) {
    return this.campaignsService.publish(id);
  }

  @Patch('archive/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  archive(@Param('id') id: string) {
    return this.campaignsService.archive(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}

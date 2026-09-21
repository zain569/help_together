import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN || UserRole.USER)
  @Get('dashboard')
  dashboard() {
    return this.adminService.adminDashboard();
  }
}

import { Controller, Post, Body, BadRequestException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './jwt/jwt.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async createAdmin(@Body() dto: any) {
    return this.authService.createAdmin(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req) {
    console.log('=== AUTH PROFILE DEBUG ===');
    console.log('Request user from JWT:', req.user);
    console.log('User ID:', req.user?.userId);
    console.log('User Role:', req.user?.role);
    
    if (!req.user?.userId) {
      throw new BadRequestException('Invalid token: missing user ID');
    }
    
    // Use auth service to get full user data with verification fields
    return await this.authService.getFullUserProfile(req.user.userId);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}

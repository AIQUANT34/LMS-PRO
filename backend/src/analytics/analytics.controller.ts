import { Controller, Get, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('course/:courseId')
  @UseGuards(JwtGuard)
  async getCourseAnalytics(
    @Param('courseId') courseId: string,
    @Req() req: any,
  ) {
    return this.analyticsService.getCourseAnalytics(courseId, req.user.userId);
  }

  @Get('student')
  @UseGuards(JwtGuard)
  async getStudentAnalytics(@Req() req: any) {
    return this.analyticsService.getStudentAnalytics(req.user.userId);
  }

  @Get('trainer')
  @UseGuards(JwtGuard)
  async getTrainerAnalytics(@Req() req: any) {
    return this.analyticsService.getTrainerAnalytics(req.user.userId);
  }

  @Get('system')
  @UseGuards(JwtGuard)
  async getSystemAnalytics(@Req() req: any) {
    // Only admin should access system analytics
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized access to system analytics');
    }
    return this.analyticsService.getSystemAnalytics();
  }

  @Get('learning-path')
  @UseGuards(JwtGuard)
  async getLearningPathAnalytics(@Req() req: any) {
    return this.analyticsService.getLearningPathAnalytics(req.user.userId);
  }

  @Get('revenue')
  @UseGuards(JwtGuard)
  async getRevenueAnalytics(@Req() req: any, @Query('period') period?: string) {
    return this.analyticsService.getRevenueAnalytics(
      req.user.userId,
      req.user.role,
    );
  }

  @Get('dashboard')
  @UseGuards(JwtGuard)
  async getDashboardAnalytics(@Req() req: any) {
    const role = req.user.role;

    switch (role) {
      case 'student':
        return this.analyticsService.getStudentAnalytics(req.user.userId);
      case 'trainer':
        return this.analyticsService.getTrainerAnalytics(req.user.userId);
      case 'admin':
        return this.analyticsService.getSystemAnalytics();
      default:
        throw new Error('Invalid user role');
    }
  }
}

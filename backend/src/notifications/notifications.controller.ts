import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getNotifications(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('unread/count')
  @UseGuards(JwtGuard)
  async getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Put(':id/read')
  @UseGuards(JwtGuard)
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Put('read-all')
  @UseGuards(JwtGuard)
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteNotification(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.deleteNotification(id, req.user.userId);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  async createNotification(@Body() notificationData: any, @Req() req: any) {
    return this.notificationsService.createNotification({
      ...notificationData,
      userId: req.user.userId,
    });
  }

  @Post('course/:courseId')
  @UseGuards(JwtGuard)
  async createCourseNotification(
    @Param('courseId') courseId: string,
    @Body()
    data: { type: string; title: string; message: string; userIds?: string[] },
    @Req() req: any,
  ) {
    // This would create notifications for multiple users
    // For now, create for current user
    return this.notificationsService.createCourseNotifications(
      courseId,
      data.type,
      {
        ...data,
        userId: req.user.userId,
      },
    );
  }

  @Get('type/:type')
  @UseGuards(JwtGuard)
  async getNotificationsByType(@Param('type') type: string, @Req() req: any) {
    return this.notificationsService.getNotificationsByType(
      req.user.userId,
      type,
    );
  }
}

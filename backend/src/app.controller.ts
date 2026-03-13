import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-instructors')
  getTestInstructors() {
    return {
      success: true,
      message: 'Test endpoint working',
      instructors: [
        {
          _id: '1',
          name: 'Test Instructor',
          title: 'Senior Developer',
          bio: 'Test bio for instructor',
          avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="12" font-family="Arial"%3ETest%3C/text%3E%3C/svg%3E',
          rating: 4.8,
          totalStudents: 100,
          totalCourses: 5,
          experience: 3,
          location: 'Remote',
          specialties: ['development'],
          isVerified: true
        }
      ]
    };
  }

  @Post('test-enrollment')
  testEnrollment(@Body() body: any) {
    try {
      return {
        success: true,
        message: 'Test enrollment endpoint working',
        received: body,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Test enrollment failed',
        error: error.message
      };
    }
  }
}

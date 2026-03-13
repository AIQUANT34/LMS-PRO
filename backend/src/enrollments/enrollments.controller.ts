import {
  Controller,
  Param,
  Get,
  Post,
  Req,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('enrollments')
export class EnrollmentsController {
  private readonly logger = new Logger(EnrollmentsController.name);

  constructor(private readonly enrollmentsService: EnrollmentsService) {
    this.logger.log('EnrollmentsController initialized');
  }

  // Test endpoint to verify service works
  @Get('test')
  async testEnrollments() {
    try {
      this.logger.log('Testing enrollments service');
      return {
        success: true,
        message: 'Enrollments service is working',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Test endpoint failed:', error);
      throw new HttpException(
        'Enrollments service test failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // COMPLETE COURSE FIRST (static route first)
  @Post('complete')
  @UseGuards(JwtGuard)
  async completeCourse(
    @Req() req,
    @Body('userId') userId: string,
    @Body('courseId') courseId: string,
  ) {
    try {
      this.logger.log(`Completing course ${courseId} for user ${userId}`);
      const result = await this.enrollmentsService.completeCourse(userId, courseId);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      this.logger.error(`Failed to complete course: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to complete course',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // THEN dynamic route
  @Post(':courseId')
  @UseGuards(JwtGuard)
  async enroll(@Param('courseId') courseId: string, @Req() req) {
    try {
      this.logger.log(`Enrolling user ${req.user?.userId || req.user?.sub} in course ${courseId}`);
      
      const userId = req.user?.userId || req.user?.sub;
      if (!userId) {
        throw new HttpException('User ID not found in token', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.enrollmentsService.enrollCourse(userId, courseId);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      this.logger.error(`Failed to enroll in course: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to enroll in course',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Enroll endpoint for frontend compatibility
  @Post('enroll')
  @UseGuards(JwtGuard)
  async enrollWithBody(@Body('courseId') courseId: string, @Req() req) {
    try {
      this.logger.log(`Enrollment request received for course: ${courseId}`);
      
      const userId = req.user?.userId || req.user?.sub;
      if (!userId) {
        this.logger.warn('User ID not found in token');
        return {
          success: false,
          message: 'User authentication required',
          error: 'User ID not found in token'
        };
      }

      if (!courseId) {
        this.logger.warn('Course ID not provided in request');
        return {
          success: false,
          message: 'Course ID is required',
          error: 'Course ID not provided'
        };
      }

      this.logger.log(`Processing enrollment for user ${userId} in course ${courseId}`);
      
      const result = await this.enrollmentsService.enrollCourse(userId, courseId);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      this.logger.error(`Enrollment failed: ${error.message}`, error.stack);
      
      // Never return 500 - always return proper JSON response
      return {
        success: false,
        message: error.message || 'Failed to enroll in course',
        error: error.message,
        // Include more details in development
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          userId: req.user?.userId || req.user?.sub,
          courseId: courseId
        })
      };
    }
  }

  @Get('my-courses')
  @UseGuards(JwtGuard)
  async getMyCourses(@Req() req) {
    try {
      const userId = req.user?.userId || req.user?.sub;
      if (!userId) {
        this.logger.warn('User ID not found in request');
        throw new HttpException('User ID not found in token', HttpStatus.UNAUTHORIZED);
      }

      this.logger.log(`Fetching courses for user ${userId}`);
      
      const enrollments = await this.enrollmentsService.getMyEnrollments(userId);
      
      return {
        success: true,
        data: enrollments,
        count: enrollments.length,
        message: `Found ${enrollments.length} enrollments`
      };
    } catch (error) {
      this.logger.error(`Failed to fetch enrollments: ${error.message}`, error.stack);
      
      // Return a proper error response instead of throwing 500
      return {
        success: false,
        data: [],
        count: 0,
        message: 'Failed to fetch enrollments',
        error: error.message
      };
    }
  }
}

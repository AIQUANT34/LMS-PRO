import { Controller, Get, Post, Put, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  CreateCourseDto,
  UpdateCourseDto,
  ReviewDecisionDto,
} from './dto/course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // Get public courses (public)
  @Get('public')
  async getPublicCourses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    try {
      const result = await this.coursesService.getPublicCourses(
        parseInt(page),
        parseInt(limit),
        category,
        level,
      );
      
      return {
        success: true,
        courses: result.courses.map((course: any) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          category: course.level, // Use level as category for frontend compatibility
          level: course.level,
          instructorId: { 
            name: course.instructorId?.name || 'Expert Instructor',
            avatar: course.instructorId?.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbnN0cjwvdGV4dD48L3N2Zz4='
          },
          ratings: { 
            average: course.ratings?.average || 0, 
            count: course.ratings?.count || 0 
          },
          enrollmentCount: course.enrollmentCount || 0,
          originalPrice: course.price || 0,
          thumbnail: course.thumbnail,
          duration: course.duration || '10 hours',
          totalLessons: course.totalLessons || 0,
          updatedAt: (course as any).updatedAt || (course as any).createdAt || new Date() // Type assertion for timestamps
        })),
        pagination: result.pagination
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch public courses',
        error: error.message
      };
    }
  }

  // Create course (instructor only)
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('instructor')
  async createCourse(@Body() body: CreateCourseDto, @Req() req) {
    return this.coursesService.createCourse(body, req.user);
  }

  // Create course (trainer only) - NEW
  @Post('trainer/create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async createTrainerCourse(@Body() body: CreateCourseDto, @Req() req) {
    return this.coursesService.createCourse(body, req.user);
  }

  // Get trainer's courses (trainer only) - NEW
  @Get('trainer/courses')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getTrainerCourses(@Req() req) {
    return this.coursesService.getInstructorCourses(req.user);
  }

  // Update course (owner only)
  @Put(':id')
  @UseGuards(JwtGuard)
  async updateCourse(
    @Param('id') courseId: string,
    @Body() body: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.updateCourse(courseId, body, req.user);
  }

  // Submit for review (owner only)
  @Post(':id/submit-review')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('instructor')
  async submitForReview(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.submitForReview(courseId, req.user);
  }

  // Review course (admin only)
  @Post(':id/review')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async reviewCourse(
    @Param('id') courseId: string,
    @Body() body: ReviewDecisionDto,
    @Req() req,
  ) {
    return this.coursesService.reviewCourse(
      courseId,
      body.decision,
      body.reason || '',
      req.user,
    );
  }

  // Archive course (owner/admin)
  @Post(':id/archive')
  @UseGuards(JwtGuard)
  async archiveCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.archiveCourse(courseId, req.user);
  }

  // Move published course to draft (owner/admin)
  @Post(':id/move-draft')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('instructor', 'admin')
  async moveToDraft(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.moveToDraft(courseId, req.user);
  }

  // Delete course (soft delete, owner/admin)
  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.deleteCourse(courseId, req.user);
  }

  // Get instructor's courses (instructor/admin)
  @Get('instructor')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('instructor', 'admin')
  async getInstructorCourses(@Req() req) {
    return this.coursesService.getInstructorCourses(req.user);
  }

  // Get single course details (public for published, owner for others)
  @Get(':id')
  async getCourse(@Param('id') courseId: string, @Req() req) {
    const user = req.user || null;
    // Implementation depends on whether it's public or private view
    // For now, return basic course info
    return this.coursesService.getCourseById(courseId, user);
  }
}

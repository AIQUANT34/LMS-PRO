import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  CreateCourseDto,
  UpdateCourseDto,
  ReviewDecisionDto,
} from './dto/course.dto';

@Controller('trainer')
export class TrainerController {
  constructor(private coursesService: CoursesService) {}

  // Create course (trainer only)
  @Post('courses/create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async createCourse(@Body() body: CreateCourseDto, @Req() req) {
    return this.coursesService.createCourse(body, req.user);
  }

  // Get trainer's courses (trainer only)
  @Get('courses')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getTrainerCourses(@Req() req) {
    return this.coursesService.getInstructorCourses(req.user);
  }

  // Update course (trainer only, owner)
  @Put('courses/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() body: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.updateCourse(courseId, body, req.user);
  }

  // Submit for review (trainer only)
  @Post('courses/:id/submit-review')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async submitForReview(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.submitForReview(courseId, req.user);
  }

  // Archive course (trainer only)
  @Post('courses/:id/archive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async archiveCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.archiveCourse(courseId, req.user);
  }

  // Move published course to draft (trainer only)
  @Post('courses/:id/move-draft')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async moveToDraft(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.moveToDraft(courseId, req.user);
  }

  // Delete course (trainer only)
  @Delete('courses/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async deleteCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.deleteCourse(courseId, req.user);
  }

  // Get single course details (trainer only)
  @Get('courses/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.getCourseById(courseId, req.user);
  }
}

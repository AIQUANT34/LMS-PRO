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
import { AssignmentsService } from '../assignments/assignments.service';
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
  constructor(
    private coursesService: CoursesService,
    private assignmentsService: AssignmentsService
  ) {}

  // Create course (trainer/instructor only)
  @Post('courses/create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async createCourse(@Body() body: CreateCourseDto, @Req() req) {
    console.log('=== TRAINER CONTROLLER DEBUG ===');
    console.log('Request user:', req.user);
    console.log('Request body:', body);
    
    return this.coursesService.createCourse(body, req.user);
  }

  // Get trainer's courses (trainer/instructor only)
  @Get('courses')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getTrainerCourses(@Req() req) {
    return this.coursesService.getTrainerCourses(req.user);
  }

  // Update course (trainer/instructor only, owner)
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

  // Submit for review (trainer/instructor only)
  @Post('courses/:id/submit-review')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async submitForReview(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.submitForReview(courseId, req.user);
  }

  // Archive course (trainer/instructor only)
  @Post('courses/:id/archive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async archiveCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.archiveCourse(courseId, req.user);
  }

  // Move published course to draft (trainer/instructor only)
  @Post('courses/:id/move-draft')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async moveToDraft(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.moveToDraft(courseId, req.user);
  }

  // Delete course (trainer/instructor only)
  @Delete('courses/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async deleteCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.deleteCourse(courseId, req.user);
  }

  // Get single course details (trainer/instructor only)
  @Get('courses/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getCourse(@Param('id') courseId: string, @Req() req) {
    return this.coursesService.getCourseById(courseId, req.user);
  }

  // Get trainer's assignments (trainer only)
  @Get('assignments')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async getTrainerAssignments(@Req() req) {
    return this.assignmentsService.getTrainerAssignments(req.user);
  }
}

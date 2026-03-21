import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  Delete,
} from '@nestjs/common';
import { LearningService } from './learning.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CreateLessonDto,
  UpdateProgressDto,
  UpdateVideoPlaybackDto,
  CompleteQuizDto,
  EnrollCourseDto,
} from './dto/learning.dto';

@Controller('learning')
export class LearningController {
  constructor(private learningService: LearningService) {}

  // ======================== LESSON MANAGEMENT ========================

  /**
   * Create a new lesson (Trainer only)
   * POST /learning/lessons/:courseId
   */
  @Post('lessons/:courseId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async createLesson(
    @Param('courseId') courseId: string,
    @Body() data: CreateLessonDto,
    @Req() req,
  ) {
    return this.learningService.createLesson(courseId, data, req.user);
  }

  /**
   * Get single lesson with access control
   * GET /learning/lessons/:lessonId
   */
  @Get('lessons/:lessonId')
  @UseGuards(JwtGuard)
  async getLesson(@Param('lessonId') lessonId: string, @Req() req) {
    return this.learningService.getLesson(lessonId, req.user);
  }

  @Put('lessons/:lessonId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() data: Partial<CreateLessonDto>,
    @Req() req,
  ) {
    return this.learningService.updateLesson(lessonId, data, req.user);
  }

  @Delete('lessons/:lessonId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer')
  async deleteLesson(@Param('lessonId') lessonId: string, @Req() req) {
    return this.learningService.deleteLesson(lessonId, req.user);
  }

  /**
   * Get all lessons in a course
   * GET /learning/courses/:courseId/lessons
   */
  @Get('courses/:courseId/lessons')
  @UseGuards(JwtGuard)
  async getCourseLessons(@Param('courseId') courseId: string, @Req() req) {
    return this.learningService.getCourseLessons(courseId, req.user);
  }

  // ======================== PROGRESS TRACKING ========================

  /**
   * Mark lesson as complete
   * POST /learning/progress/complete/:lessonId
   */
  @Post('progress/complete/:lessonId')
  @UseGuards(JwtGuard)
  async markLessonComplete(
    @Param('lessonId') lessonId: string,
    @Req() req,
    @Query('enrollmentId') enrollmentId?: string,
  ) {
    return this.learningService.markLessonComplete(
      lessonId,
      enrollmentId,
      req.user,
    );
  }

  /**
   * Update video progress (for frontend video tracking)
   * POST /learning/video/:lessonId/progress
   */
  @Post('video/:lessonId/progress')
  @UseGuards(JwtGuard)
  async updateVideoProgress(
    @Param('lessonId') lessonId: string,
    @Body() progressData: any,
    @Req() req,
  ) {
    return this.learningService.updateVideoProgress(lessonId, progressData, req.user);
  }

  /**
   * Get student completions for trainer dashboard
   * GET /learning/videohistory/student-completions
   */
  @Get('videohistory/student-completions')
  @UseGuards(JwtGuard)
  @Roles('trainer')
  async getStudentCompletions(@Req() req) {
    console.log("🎯 CONTROLLER - Request user:", req.user);
    console.log("🎯 CONTROLLER - User ID:", req.user?.userId);
    console.log("🎯 CONTROLLER - User roles:", req.user?.roles);
    
    const result = await this.learningService.getStudentCompletions(req.user);
    
    // Ensure proper JSON serialization
    return {
      success: true,
      data: result,
      message: 'Student completions retrieved successfully'
    };
  }

  @Put('progress/incomplete/:lessonId')
  @UseGuards(JwtGuard)
  async markLessonIncomplete(
    @Param('lessonId') lessonId: string,
    @Query('enrollmentId') enrollmentId: string,
    @Req() req,
  ) {
    return this.learningService.markLessonIncomplete(
      lessonId,
      enrollmentId,
      req.user,
    );
  }

  /**
   * Get course progress for a user
   * GET /learning/progress/course/:courseId
   */
  @Get('progress/course/:courseId')
  @UseGuards(JwtGuard)
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @Req() req,
  ) {
    return this.learningService.getCourseProgress(courseId, req.user);
  }

  /**
   * Get completed courses for a student
   * GET /learning/videohistory/completed-courses
   */
  @Get('videohistory/completed-courses')
  @UseGuards(JwtGuard)
  async getCompletedCourses(@Req() req) {
    return this.learningService.getCompletedCourses(req.user);
  }
  // ======================== VIDEO PLAYBACK ========================

  /**
   * Save video playback position
   * PUT /learning/video/:lessonId/playback
   */
  @Put('video/:lessonId/playback')
  @UseGuards(JwtGuard)
  async updateVideoPlayback(
    @Param('lessonId') lessonId: string,
    @Query('enrollmentId') enrollmentId: string,
    @Body() data: UpdateVideoPlaybackDto,
    @Req() req,
  ) {
    return this.learningService.updateVideoPlayback(
      lessonId,
      enrollmentId,
      data,
      req.user,
    );
  }

  /**
   * Get video progress (resume position)
   * GET /learning/video/:lessonId/progress
   */
  @Get('video/:lessonId/progress')
  @UseGuards(JwtGuard)
  async getVideoProgress(@Param('lessonId') lessonId: string, @Req() req) {
    return this.learningService.getVideoProgress(lessonId, req.user);
  }

  // ======================== DASHBOARD ========================

  /**
   * Get student dashboard with all enrolled courses
   * GET /learning/dashboard
   */
  @Get('dashboard')
  @UseGuards(JwtGuard)
  async getStudentDashboard(@Req() req) {
    return this.learningService.getStudentDashboard(req.user);
  }

  /**
   * Get resume data to continue learning from last position
   * GET /learning/resume/:courseId
   */
  @Get('resume/:courseId')
  @UseGuards(JwtGuard)
  async getResumeData(@Param('courseId') courseId: string, @Req() req) {
    return this.learningService.getResumeData(courseId, req.user);
  }
}

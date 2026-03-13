import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AssessmentsService } from './assessments.service';

import { SubmitAssessmentDto, ReviewSubmissionDto } from './dto/submission.dto';

import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  // Get quiz details
  @UseGuards(JwtGuard)
  @Get('quiz/:quizId')
  async getQuiz(@Param('quizId') quizId: string, @Req() req: any) {
    return this.assessmentsService.getQuiz(quizId, req.user);
  }

  // Get assessments of a course (student)
  @UseGuards(JwtGuard)
  @Get('course/:courseId')
  async getAssessmentsByCourse(
    @Param('courseId') courseId: string,
    @Req() req: any,
  ) {
    return this.assessmentsService.getAssessmentsByCourse(courseId, req.user);
  }

  // Student submits assessment
  @UseGuards(JwtGuard)
  @Post(':assessmentId/submit')
  async submitAssessment(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: SubmitAssessmentDto,
    @Req() req: any,
  ) {
    return this.assessmentsService.submitAssessment(
      assessmentId,
      dto,
      req.user,
    );
  }

  // Submit quiz (alias for submit assessment)
  @UseGuards(JwtGuard)
  @Post('submit')
  async submitQuiz(@Body() submitData: any, @Req() req: any) {
    return this.assessmentsService.submitAssessment(
      submitData.quizId,
      submitData,
      req.user,
    );
  }

  // Student gets their submission
  @UseGuards(JwtGuard)
  @Get(':assessmentId/my-submission')
  async getMySubmission(
    @Param('assessmentId') assessmentId: string,
    @Req() req: any,
  ) {
    return this.assessmentsService.getMySubmission(assessmentId, req.user);
  }

  // Get quiz submissions (alias for my-submission)
  @UseGuards(JwtGuard)
  @Get('my/:quizId')
  async getQuizSubmissions(@Param('quizId') quizId: string, @Req() req: any) {
    return this.assessmentsService.getMySubmission(quizId, req.user);
  }

  // Instructor reviews submission
  @UseGuards(JwtGuard)
  @Post('submission/:submissionId/review')
  async reviewSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ReviewSubmissionDto,
    @Req() req: any,
  ) {
    return this.assessmentsService.reviewSubmission(
      submissionId,
      dto,
      req.user,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':assessmentId/submissions')
  async getAssessmentSubmissions(
    @Param('assessmentId') assessmentId: string,
    @Req() req: any,
  ) {
    return this.assessmentsService.getAssessmentSubmissions(
      assessmentId,
      req.user,
    );
  }
}

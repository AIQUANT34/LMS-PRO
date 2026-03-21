import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';

import { SubmissionService } from './submission.service';
import { SubmitAssessmentDto, ReviewSubmissionDto } from './dto/submission.dto';

import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('submissions')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  // Submit assignment (for assignments, not assessments)
  @UseGuards(JwtGuard)
  @Post('submit')
  async submitAssignment(@Body() submitData: any, @Req() req: any) {
    return this.submissionService.submitAssignment(submitData, req.user);
  }

  // Get user's submission for assignment
  @UseGuards(JwtGuard)
  @Get('my/:assignmentId')
  async getMySubmission(
    @Param('assignmentId') assignmentId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getMySubmission(assignmentId, req.user);
  }

  // Get all submissions for a course (trainer view)
  @UseGuards(JwtGuard)
  @Get('course/:courseId')
  async getCourseSubmissions(
    @Param('courseId') courseId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getCourseSubmissions(courseId, req.user);
  }

  // Get specific submission details
  @UseGuards(JwtGuard)
  @Get(':submissionId')
  async getSubmission(
    @Param('submissionId') submissionId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getSubmissionById(submissionId, req.user);
  }

  // Update submission (student)
  @UseGuards(JwtGuard)
  @Put(':submissionId')
  async updateSubmission(
    @Param('submissionId') submissionId: string,
    @Body() updateData: any,
    @Req() req: any,
  ) {
    return this.submissionService.updateSubmission(
      submissionId,
      updateData,
      req.user,
    );
  }

  // Delete submission (student)
  @UseGuards(JwtGuard)
  @Delete(':submissionId')
  async deleteSubmission(
    @Param('submissionId') submissionId: string,
    @Req() req: any,
  ) {
    return this.submissionService.deleteSubmission(submissionId, req.user);
  }

  // Get assessments of a course (student)
  @UseGuards(JwtGuard)
  @Get('assessment/:courseId')
  async getAssessmentsByCourse(
    @Param('courseId') courseId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getAssessmentsByCourse(courseId, req.user);
  }

  // Student submits assessment
  @UseGuards(JwtGuard)
  @Post('assessment/:assessmentId/submit')
  async submitAssessment(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: SubmitAssessmentDto,
    @Req() req: any,
  ) {
    return this.submissionService.submitAssessment(assessmentId, dto, req.user);
  }

  // Student gets their submission
  @UseGuards(JwtGuard)
  @Get('assessment/:assessmentId/my-submission')
  async getMyAssessmentSubmission(
    @Param('assessmentId') assessmentId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getMySubmission(assessmentId, req.user);
  }

  // Trainer reviews submission
  @UseGuards(JwtGuard)
  @Post('assessment/submission/:submissionId/review')
  async reviewSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ReviewSubmissionDto,
    @Req() req: any,
  ) {
    return this.submissionService.reviewSubmission(submissionId, dto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('assessment/:assessmentId/submissions')
  async getAssessmentSubmissions(
    @Param('assessmentId') assessmentId: string,
    @Req() req: any,
  ) {
    return this.submissionService.getAssessmentSubmissions(
      assessmentId,
      req.user,
    );
  }
}

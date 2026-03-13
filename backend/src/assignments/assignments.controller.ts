import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import {
  CreateAssignmentDto,
  SubmitAssignmentDto,
} from './dto/assignments.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get(':assignmentId')
  @UseGuards(JwtGuard)
  async getAssignment(@Param('assignmentId') assignmentId: string, @Req() req) {
    return this.assignmentsService.getAssignment(assignmentId, req.user);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  async createAssignment(
    @Body() assignmentData: CreateAssignmentDto,
    @Req() req,
  ) {
    return this.assignmentsService.createAssignment(assignmentData, req.user);
  }

  @Get('course/:courseId')
  @UseGuards(JwtGuard)
  async getCourseAssignments(@Param('courseId') courseId: string, @Req() req) {
    return this.assignmentsService.getCourseAssignments(courseId, req.user);
  }
}

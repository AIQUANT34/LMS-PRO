import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto, UpdateLectureDto, ReorderLecturesDto, AddResourceFileDto, UpdateMetricsDto } from './dto/lecture.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLectureDto: CreateLectureDto, @Request() req) {
    return this.lectureService.create(createLectureDto, req.user.userId);
  }

  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.lectureService.findByCourse(courseId, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.lectureService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto, @Request() req) {
    return this.lectureService.update(id, updateLectureDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.lectureService.remove(id, req.user.userId);
  }

  @Patch(':id/metrics')
  async updateMetrics(@Param('id') id: string, @Body() updateMetricsDto: UpdateMetricsDto) {
    return this.lectureService.updateMetrics(id, updateMetricsDto);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  async reorderLectures(@Body() reorderLecturesDto: ReorderLecturesDto, @Request() req) {
    await this.lectureService.reorderLectures(
      reorderLecturesDto.lectureOrders[0]?.id ? 'extract from first lecture' : '',
      reorderLecturesDto.lectureOrders,
      req.user.userId,
    );
  }

  @Post(':id/resources')
  async addResourceFile(
    @Param('id') id: string,
    @Body() addResourceFileDto: AddResourceFileDto,
    @Request() req,
  ) {
    return this.lectureService.addResourceFile(id, addResourceFileDto, req.user.userId);
  }

  @Delete(':id/resources')
  @HttpCode(HttpStatus.OK)
  async removeResourceFile(@Param('id') id: string, @Body('fileUrl') fileUrl: string, @Request() req) {
    return this.lectureService.removeResourceFile(id, fileUrl, req.user.userId);
  }

  @Get('course/:courseId/stats')
  async getLectureStats(@Param('courseId') courseId: string, @Request() req) {
    return this.lectureService.getLectureStats(courseId, req.user.userId);
  }
}

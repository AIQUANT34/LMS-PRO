import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { TrainerController } from './trainer.controller';
import { CoursesService } from './courses.service';
import { CourseSchema } from './schemas/course.schema';
import { LectureSchema } from './schemas/lecture.schema';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { CourseOwnerGuard } from './guards/course-owner.guard';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'Lecture', schema: LectureSchema },
    ]),
    UploadModule,
  ],
  controllers: [CoursesController, TrainerController, LectureController],
  providers: [CoursesService, LectureService, CourseOwnerGuard],
  exports: [CoursesService, LectureService],
})
export class CoursesModule {}

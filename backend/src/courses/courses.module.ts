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
import { AssignmentsModule } from '../assignments/assignments.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'Lecture', schema: LectureSchema },
      { name: 'User', schema: UserSchema }, // Add UserModel for CoursesService
    ]),
    UploadModule,
    AssignmentsModule,
  ],
  controllers: [CoursesController, TrainerController, LectureController],
  providers: [CoursesService, LectureService, CourseOwnerGuard],
  exports: [CoursesService, LectureService],
})
export class CoursesModule {}

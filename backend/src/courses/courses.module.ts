import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { CourseOwnerGuard } from './guards/course-owner.guard';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema},
    ]),
  ],
  providers: [CoursesService, CourseOwnerGuard],
  controllers: [CoursesController],
  exports: [CoursesService, CourseOwnerGuard],
})
export class CoursesModule {}

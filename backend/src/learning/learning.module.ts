import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { Progress, ProgressSchema } from './schemas/progress.schema';
import { VideoHistory, VideoHistorySchema } from './schemas/video-history.schema';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: VideoHistory.name, schema: VideoHistorySchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    EnrollmentsModule,
    CoursesModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
  exports: [LearningService],
})
export class LearningModule {}

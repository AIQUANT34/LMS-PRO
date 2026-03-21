import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AIReviewService } from './ai-review.service';
import { AIReviewController } from './ai-review.controller';

import { User, UserSchema } from '../users/schemas/user.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { Progress, ProgressSchema } from 'src/learning/schemas/progress.schema';
import { AIReviewLog, AIReviewLogSchema } from './schemas/ai-review-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: AIReviewLog.name, schema: AIReviewLogSchema },
    ]),
  ],

  providers: [AiService, AIReviewService],
  controllers: [AiController, AIReviewController],
})
export class AiModule {}

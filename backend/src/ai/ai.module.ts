import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AiService } from './ai.service';
import { AiController } from './ai.controller';

import { User, UserSchema } from '../users/schemas/user.schema'
import { Course, CourseSchema} from '../courses/schemas/course.schema'
import { Progress, ProgressSchema } from 'src/learning/schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Progress.name, schema: ProgressSchema }

    ]),
  ],
  

  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}

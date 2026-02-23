import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Assessment,
  AssessmentSchema
} from './schemas/assessment.schema';

import {
  Submission,
  SubmissionSchema
} from '../submission/schemas/submission.schema';

import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';

@Module({

  imports: [

    MongooseModule.forFeature([
      {
        name: Assessment.name,
        schema: AssessmentSchema
      },

      {
        name: Submission.name,
        schema: SubmissionSchema
      }

    ])

  ],

  controllers: [AssessmentsController],

  providers: [AssessmentsService],

})
export class AssessmentsModule {}
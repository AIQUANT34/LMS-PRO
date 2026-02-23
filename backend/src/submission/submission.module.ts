import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Submission, SubmissionSchema } from './schemas/submission.schema'

@Module({

    imports: [
        MongooseModule.forFeature([
            {
                name: Submission.name,
                schema: SubmissionSchema
            }
        ])
    ],
    exports: [
        MongooseModule
    ]
})

export class SubmissionModule {}
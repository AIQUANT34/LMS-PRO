import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';

@Module({

  imports: [
        MongooseModule.forFeature([
          {name: Enrollment.name, schema: EnrollmentSchema},
        ]),
  ],

  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],

  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

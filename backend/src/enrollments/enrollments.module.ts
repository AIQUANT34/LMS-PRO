import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';
import { CertificatesModule } from 'src/certificates/certificates.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    CertificatesModule,
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],

  exports: [EnrollmentsService, MongooseModule],
})
export class EnrollmentsModule {}

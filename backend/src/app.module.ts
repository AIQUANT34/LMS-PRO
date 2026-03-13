import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/schemas/user.schema';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { InstructorsModule } from './instructors/instructors.module';
import { UploadModule } from './upload/upload.module';
import { LearningModule } from './learning/learning.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { SubmissionModule } from './submission/submission.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AiModule } from './ai/ai.module';
import { BlockchainService } from './blockchain/blockchain.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UsersModule,
    CoursesModule,
    InstructorsModule,
    EnrollmentsModule,
    UploadModule,
    LearningModule,
    AssessmentsModule,
    SubmissionModule,
    CertificatesModule,
    AiModule,
    BlockchainModule,
    AssignmentsModule,
    NotificationsModule,
    SearchModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BlockchainService],
})
export class AppModule {}

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Progress, ProgressDocument } from './schemas/progress.schema';
import {
  VideoHistory,
  VideoHistoryDocument,
} from './schemas/video-history.schema';
import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollments/schemas/enrollment.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

import {
  CreateLessonDto,
  UpdateVideoPlaybackDto,
  CompleteQuizDto,
} from './dto/learning.dto';

@Injectable()
export class LearningService {
  constructor(
    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,

    @InjectModel(Progress.name)
    private progressModel: Model<ProgressDocument>,

    @InjectModel(VideoHistory.name)
    private videoHistoryModel: Model<VideoHistoryDocument>,

    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,

    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  /*
  ============================================================
  LESSON MANAGEMENT
  ============================================================
  */

  async createLesson(courseId: string, data: CreateLessonDto, user: any) {
    const course = await this.courseModel.findById(courseId);

    if (!course)
      throw new NotFoundException('Course not found');

    if (
      course.instructorId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'You can only add lessons to your courses',
      );
    }

    const lesson = await this.lessonModel.create({
      ...data,
      courseId,
    });

    return {
      message: 'Lesson created successfully',
      lesson,
    };
  }

  async getLesson(lessonId: string, user: any) {
    const lesson = await this.lessonModel
      .findById(lessonId)
      .populate('courseId');

    if (!lesson)
      throw new NotFoundException('Lesson not found');

    const course = lesson.courseId as any;

    const enrollment =
      await this.enrollmentModel.findOne({
        user: user.userId,
        course: course._id,
      });

    if (
      !lesson.isFree &&
      !enrollment &&
      user.role === 'student'
    ) {
      throw new ForbiddenException(
        'You must enroll to access this lesson',
      );
    }

    return lesson;
  }

  async getCourseLessons(courseId: string, user: any) {
    const course = await this.courseModel.findById(courseId);

    if (!course)
      throw new NotFoundException('Course not found');

    const enrollment =
      await this.enrollmentModel.findOne({
        user: user.userId,
        course: courseId,
      });

    if (enrollment) {
      const lessons =
        await this.lessonModel
          .find({ courseId })
          .sort({ sequence: 1 });

      return {
        lessons,
        isEnrolled: true,
      };
    }

    const freeLessons =
      await this.lessonModel
        .find({ courseId, isFree: true })
        .sort({ sequence: 1 });

    return {
      lessons: freeLessons,
      isEnrolled: false,
    };
  }

  async updateLesson(
    lessonId: string,
    data: Partial<CreateLessonDto>,
    user: any,
  ) {
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) throw new NotFoundException('Lesson not found');

    const course = await this.courseModel.findById(lesson.courseId);

    if (!course) throw new NotFoundException('Course not found');

    if (
      course.instructorId.toString() !== user.userId &&
      user.role !== 'admin'
    )
      throw new ForbiddenException('You can only edit your lessons');

    Object.assign(lesson, data);
    await lesson.save();

    return {
      message: 'Lesson updated successfully',
      lesson,
    };
  }

  async deleteLesson(lessonId: string, user: any) {
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) throw new NotFoundException('Lesson not found');

    const course = await this.courseModel.findById(lesson.courseId);

    if (!course) throw new NotFoundException('Course not found');

    if (
      course.instructorId.toString() !== user.userId &&
      user.role !== 'admin'
    )
      throw new ForbiddenException('You can only delete your lessons');

    await this.lessonModel.deleteOne({ _id: lessonId });

    // clean up related progress and history
    await this.progressModel.deleteMany({ lessonId });
    await this.videoHistoryModel.deleteMany({ lessonId });

    return {
      message: 'Lesson deleted successfully',
    };
  }

  /*
  ============================================================
  PROGRESS MANAGEMENT
  ============================================================
  */

  async markLessonComplete(
    lessonId: string,
    enrollmentId: string,
    user: any,
  ) {
    const lesson =
      await this.lessonModel.findById(lessonId);

    if (!lesson)
      throw new NotFoundException('Lesson not found');

    const enrollment =
      await this.enrollmentModel.findById(
        enrollmentId,
      );

    if (!enrollment)
      throw new NotFoundException('Enrollment not found');

    if (
      enrollment.user.toString() !== user.userId
    )
      throw new ForbiddenException('Access denied');

    let progress =
      await this.progressModel.findOne({
        userId: user.userId,
        lessonId,
        enrollmentId,
      });

    if (!progress) {
      progress =
        await this.progressModel.create({
          userId: user.userId,
          courseId: lesson.courseId,
          lessonId,
          enrollmentId,
          isCompleted: true,
          completedAt: new Date(),
        });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();
    }

    await this.calculateCourseProgress(
      lesson.courseId.toString(),
      user.userId,
    );

    return {
      message: 'Lesson marked complete',
      progress,
    };
  }

  async markLessonIncomplete(
    lessonId: string,
    enrollmentId: string,
    user: any,
  ) {
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) throw new NotFoundException('Lesson not found');

    const enrollment = await this.enrollmentModel.findById(
      enrollmentId,
    );

    if (!enrollment)
      throw new NotFoundException('Enrollment not found');

    if (enrollment.user.toString() !== user.userId)
      throw new ForbiddenException('Access denied');

    const progress = await this.progressModel.findOne({
      userId: user.userId,
      lessonId,
      enrollmentId,
    });

    if (!progress) {
      return {
        message: 'No progress found for this lesson',
      };
    }

    progress.isCompleted = false;
    progress.completedAt = undefined as any;
    await progress.save();

    await this.calculateCourseProgress(
      lesson.courseId.toString(),
      user.userId,
    );

    return {
      message: 'Lesson marked incomplete',
      progress,
    };
  }

  /*
  ============================================================
  VIDEO PLAYBACK SYSTEM
  ============================================================
  */

  async updateVideoPlayback(
    lessonId: string,
    enrollmentId: string,
    data: UpdateVideoPlaybackDto,
    user: any,
  ) {
    const lesson =
      await this.lessonModel.findById(lessonId);

    if (!lesson)
      throw new NotFoundException('Lesson not found');

    const enrollment =
      await this.enrollmentModel.findById(
        enrollmentId,
      );

    if (
      !enrollment ||
      enrollment.user.toString() !== user.userId
    )
      throw new ForbiddenException('Access denied');

    const watchedPercentage =
      data.duration > 0
        ? Math.round(
            (data.currentTime /
              data.duration) *
              100,
          )
        : 0;

    /*
    ------------------------------
    VIDEO HISTORY
    ------------------------------
    */

    let videoHistory =
      await this.videoHistoryModel.findOne({
        userId: user.userId,
        lessonId,
      });

    if (!videoHistory) {
      videoHistory =
        await this.videoHistoryModel.create({
          userId: user.userId,
          lessonId,
          courseId: lesson.courseId,
          currentTime: data.currentTime,
          videoDuration: data.duration,
          lastWatchedAt: new Date(),
          quality: data.quality || '720p',
          isSubtitlesEnabled:
            data.isSubtitlesEnabled || false,
          watchRate: data.watchRate || 1,
          isCompleted:
            watchedPercentage >= 95,
        });
    } else {
      videoHistory.currentTime =
        data.currentTime;

      videoHistory.videoDuration =
        data.duration;

      videoHistory.lastWatchedAt =
        new Date();

      videoHistory.isCompleted =
        watchedPercentage >= 95;

      await videoHistory.save();
    }

    /*
    ------------------------------
    PROGRESS UPDATE
    ------------------------------
    */

    await this.progressModel.updateOne(
      {
        userId: user.userId,
        lessonId,
        enrollmentId,
      },
      {
        $set: {
          userId: user.userId,
          courseId: lesson.courseId,
          lessonId,
          enrollmentId,

          videoProgress: {
            currentTime:
              data.currentTime,
            duration: data.duration,
            watchedPercentage,
            lastUpdated: new Date(),
          },

          lastAccessedAt: new Date(),

          isCompleted:
            watchedPercentage >= 95,

          completedAt:
            watchedPercentage >= 95
              ? new Date()
              : null,
        },
      },
      { upsert: true },
    );

    if (watchedPercentage >= 95) {
      await this.calculateCourseProgress(
        lesson.courseId.toString(),
        user.userId,
      );
    }

    return {
      message:
        'Video progress saved',
      videoHistory,
    };
  }

  async getVideoProgress(
    lessonId: string,
    user: any,
  ) {
    const videoHistory =
      await this.videoHistoryModel.findOne({
        userId: user.userId,
        lessonId,
      });

    if (!videoHistory) {
      return {
        currentTime: 0,
      };
    }

    return videoHistory;
  }

  /*
  ============================================================
  QUIZ SYSTEM
  ============================================================
  */

  async submitQuiz(
    lessonId: string,
    enrollmentId: string,
    data: CompleteQuizDto,
    user: any,
  ) {
    const lesson =
      await this.lessonModel.findById(
        lessonId,
      );

    if (!lesson)
      throw new NotFoundException(
        'Quiz not found',
      );

    let progress =
      await this.progressModel.findOne({
        userId: user.userId,
        lessonId,
        enrollmentId,
      });

    if (!progress) {
      progress =
        await this.progressModel.create({
          userId: user.userId,
          courseId: lesson.courseId,
          lessonId,
          enrollmentId,
        });
    }

    progress.quizScore =
      data.score;

    progress.isQuizPassed =
      data.score >= 70;

    progress.quizAttempts =
      (progress.quizAttempts || 0) + 1;

    if (progress.isQuizPassed) {
      progress.isCompleted = true;
      progress.completedAt =
        new Date();
    }

    await progress.save();

    await this.calculateCourseProgress(
      lesson.courseId.toString(),
      user.userId,
    );

    return progress;
  }

  async getCourseProgress(courseId: string, user: any) {
    const enrollment = await this.enrollmentModel.findOne({
      user: user.userId,
      course: courseId,
    });

    if (!enrollment)
      throw new NotFoundException('Enrollment not found');

    // return enrollment progress and basic stats
    return {
      courseId,
      progress: enrollment.progress || 0,
      status: enrollment.status || 'inactive',
    };
  }

  async getCertificate(courseId: string, user: any) {
    const enrollment = await this.enrollmentModel.findOne({
      user: user.userId,
      course: courseId,
    });

    if (!enrollment)
      throw new NotFoundException('Enrollment not found');

    const certificate = await this.certificateModel.findOne({
      courseId,
      userId: user.userId,
    });

    if (!certificate)
      throw new NotFoundException('Certificate not found');

    return certificate;
  }

  async getStudentDashboard(user: any) {
    const enrollments = await this.enrollmentModel
      .find({ user: user.userId })
      .populate('course');

    return enrollments.map((en: any) => ({
      course: en.course,
      progress: en.progress || 0,
      status: en.status,
    }));
  }

  async getResumeData(courseId: string, user: any) {
    // find last video history for this user and course
    const lastVideo = await this.videoHistoryModel
      .findOne({ userId: user.userId, courseId })
      .sort({ lastWatchedAt: -1 });

    if (!lastVideo) return { currentTime: 0 };

    return {
      lessonId: lastVideo.lessonId,
      currentTime: lastVideo.currentTime,
      videoDuration: lastVideo.videoDuration,
      lastWatchedAt: lastVideo.lastWatchedAt,
    };
  }

  /*
  ============================================================
  CERTIFICATE SYSTEM
  ============================================================
  */

  private async generateCertificate(
    courseId: string,
    userId: string,
  ) {
    const existing =
      await this.certificateModel.findOne({
        courseId,
        userId,
      });

    if (existing) return;

    await this.certificateModel.create({
      certificateId:
        'CERT-' + Date.now(),
      userId,
      courseId,
      issuedAt: new Date(),
      isValid: true,
    });
  }

  /*
  ============================================================
  COURSE PROGRESS CALCULATION
  ============================================================
  */

  private async calculateCourseProgress(
    courseId: string,
    userId: string,
  ) {
    const total =
      await this.lessonModel.countDocuments(
        { courseId },
      );

    const completed =
      await this.progressModel.countDocuments(
        {
          courseId,
          userId,
          isCompleted: true,
        },
      );

    const percent =
      total === 0
        ? 0
        : Math.round(
            (completed / total) *
              100,
          );

    await this.enrollmentModel.updateOne(
      {
        user: userId,
        course: courseId,
      },
      {
        progress: percent,
        status:
          percent === 100
            ? 'completed'
            : 'active',
      },
    );

    if (percent === 100)
      await this.generateCertificate(
        courseId,
        userId,
      );
  }
}
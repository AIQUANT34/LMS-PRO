import {
  Injectable,
  BadRequestException,
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
import { Certificate, CertificateDocument } from '../certificates/schemas/certificate.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollments/schemas/enrollment.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

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

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /*
  ============================================================
  LESSON MANAGEMENT
  ============================================================
  */

  async createLesson(courseId: string, data: CreateLessonDto, user: any) {
    const course = await this.courseModel.findById(courseId);

    if (!course) throw new NotFoundException('Course not found');

    if (
      course.trainerId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only add lessons to your courses');
    }

    // Process content field - if it contains videoUrl, move it to videoUrl field
    let processedData = { ...data };
    
    if (data.content && typeof data.content === 'string') {
      try {
        const contentObj = JSON.parse(data.content);
        if (contentObj.videoUrl) {
          console.log('🔍 Backend Debug - Moving videoUrl from content to videoUrl field:', contentObj.videoUrl);
          processedData.videoUrl = contentObj.videoUrl;
          processedData.content = JSON.stringify(contentObj);
        }
      } catch (error) {
        console.log('Failed to parse content field:', error);
      }
    }

    const lesson = await this.lessonModel.create({
      ...processedData,
      courseId,
    });

    // Update course's totalLessons count
    try {
      const lessonCount = await this.lessonModel.countDocuments({ courseId });
      console.log(`🎯 Found ${lessonCount} lessons for course ${courseId}`);
      
      const updateResult = await this.courseModel.updateOne(
        { _id: courseId }, 
        { 
          $set: { 
            totalLessons: lessonCount,
            totalDuration: course.duration || 0 // Keep existing duration or update if needed
          }
        }
      );
      
      console.log(`🎯 Course update result:`, updateResult);
      console.log(`🎯 Updated course ${courseId} totalLessons to ${lessonCount}`);
    } catch (error) {
      console.error(`🎯 Failed to update course totalLessons:`, error);
    }

    return {
      message: 'Lesson created successfully',
      lesson,
    };
  }

  async getLesson(lessonId: string, user: any) {
    const lesson = await this.lessonModel
      .findById(lessonId)
      .populate('courseId');

    if (!lesson) throw new NotFoundException('Lesson not found');

    const course = lesson.courseId as any;

    const enrollment = await this.enrollmentModel.findOne({
      user: user.userId,
      course: course._id,
    });

    if (!lesson.isFree && !enrollment && user.role === 'student') {
      throw new ForbiddenException('You must enroll to access this lesson');
    }

    return lesson;
  }

  async getCourseLessons(courseId: string, user: any) {
    // 🔥 FIX: Validate courseId before database query
    if (!courseId || courseId === 'undefined' || courseId === 'null') {
      throw new BadRequestException('Invalid course ID provided');
    }

    // Validate ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(courseId)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseModel.findById(courseId);

    if (!course) throw new NotFoundException('Course not found');

    //FIX: Trainer/Admin should see ALL lessons
    if (user?.role === 'trainer' || user?.role === 'admin') {
      const lessons = await this.lessonModel
        .find({ courseId })
        .sort({ sequence: 1 })
        .lean();
    
      return {
        lessons,
        isEnrolled: true,
      };
    }

    //for students 
    const enrollment = await this.enrollmentModel.findOne({
      user: user.userId,
      course: courseId,
    });

    if (enrollment) {
      // Step 1: Get all lessons
      const lessons = await this.lessonModel
        .find({ courseId })
        .sort({ sequence: 1 })
        .lean();

      // Step 2: Fetch progress in ONE query
      const progressList = await this.progressModel.find({
        userId: user.userId,
        courseId,
      }).lean();

      // Step 3: Map progress to lessons
      const lessonsWithProgress = lessons.map((lesson) => {
        const progress = progressList.find(
          (p) => p.lessonId.toString() === lesson._id.toString(),
        );

        return {
          ...lesson,
          isCompleted: progress?.isCompleted || false,
          videoProgress: progress?.videoProgress || null,
        };
      });

      // Step 4: Return optimized response
      return {
        lessons: lessonsWithProgress,
        isEnrolled: true,
      };
    }

    const freeLessons = await this.lessonModel
      .find({ courseId, isFree: true })
      .sort({ sequence: 1 })
      .lean();

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

    if (course.trainerId.toString() !== user.userId && user.role !== 'admin')
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

    if (course.trainerId.toString() !== user.userId && user.role !== 'admin')
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

  async markLessonComplete(lessonId: string, enrollmentId?: string, user?: any) {
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    // If no enrollmentId provided, find or create one
    if (!enrollmentId) {
      const enrollment = await this.enrollmentModel.findOne({
        user: user.userId,
        course: lesson.courseId,
      });
      
      if (!enrollment) {
        // Create enrollment if it doesn't exist
        const newEnrollment = await this.enrollmentModel.create({
          user: user.userId,
          course: lesson.courseId,
          status: 'active',
          progress: 0,
        });
        enrollmentId = (newEnrollment as any)._id.toString();
      } else {
        enrollmentId = (enrollment as any)._id.toString();
      }
    } else {
      // If enrollmentId is provided, validate it
      const enrollment = await this.enrollmentModel.findById(enrollmentId);
      if (!enrollment) throw new NotFoundException('Enrollment not found');
      if (enrollment.user.toString() !== user.userId) throw new ForbiddenException('Access denied');
    }

    // Create or update progress record
    let progress = await this.progressModel.findOne({
      userId: user.userId,
      lessonId,
      enrollmentId,
    });

    if (!progress) {
      progress = await this.progressModel.create({
        userId: user.userId,
        courseId: lesson.courseId,
        lessonId,
        enrollmentId,
        isCompleted: true,
        completedAt: new Date(),
        completionPercentage: 100,
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      progress.completionPercentage = 100;
      await progress.save();
    }

    // Also update video history
    await this.updateVideoProgress(lessonId, {
      isCompleted: true,
      completedAt: new Date(),
    }, user);

    // Update enrollment progress
    await this.updateEnrollmentProgress(lesson.courseId.toString(), user.userId);

    return {
      message: 'Lesson marked as complete',
      progress,
    };
  }

  async updateEnrollmentProgress(courseId: string, userId: string) {
    // Get all completed lessons for this user and course
    const completedLessons = await this.progressModel.countDocuments({
      userId: userId,
      courseId: courseId,
      isCompleted: true,
    });

    // Get total lessons for this course
    const totalLessons = await this.lessonModel.countDocuments({ courseId });

    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Update enrollment progress
    await this.enrollmentModel.updateOne(
      { user: userId, course: courseId },
      { 
        progress: progressPercentage,
        status: progressPercentage >= 100 ? 'completed' : 'active'
      }
    );

    console.log('🎯 Updated enrollment progress:', { courseId, userId, progressPercentage });

    // 🎓 AUTO-GENERATE CERTIFICATE IF COURSE COMPLETED
    if (progressPercentage >= 100) {
      try {
        console.log('🎓 Course completed! Auto-generating certificate...');
        
        // Get course and user details
        const [course, user] = await Promise.all([
          this.courseModel.findById(courseId).populate('trainerId', 'name'),
          this.userModel.findById(userId)
        ]);

        if (course && user) {
          // Check if certificate already exists
          const existingCertificate = await this.certificateModel.findOne({
            userId: userId,
            courseId: courseId
          });

          if (!existingCertificate) {
            // Generate certificate automatically
            const certificate = await this.certificateModel.create({
              certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
              userId: userId,
              courseId: courseId,
              studentName: user.name,
              courseName: course.title,
              completionDate: new Date(),
              trainerName: (course.trainerId as any)?.name || 'Trainer',
              isApproved: false,
            });

            console.log('🎓 Certificate auto-generated:', (certificate as any)._id);
            
            // TODO: Send notification to trainer for approval
            console.log('🎓 Certificate pending trainer approval');
          } else {
            console.log('🎓 Certificate already exists for this course');
          }
        }
      } catch (error) {
        console.error('🎓 Auto-certificate generation failed:', error);
        // Don't throw error to not break the lesson completion flow
      }
    }
  }

  async markLessonIncomplete(
    lessonId: string,
    enrollmentId: string,
    user: any,
  ) {
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) throw new NotFoundException('Lesson not found');

    const enrollment = await this.enrollmentModel.findById(enrollmentId);

    if (!enrollment) throw new NotFoundException('Enrollment not found');

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

    await this.calculateCourseProgress(lesson.courseId.toString(), user.userId);

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
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) throw new NotFoundException('Lesson not found');

    const enrollment = await this.enrollmentModel.findById(enrollmentId);

    if (!enrollment || enrollment.user.toString() !== user.userId)
      throw new ForbiddenException('Access denied');

    const watchedPercentage =
      data.duration > 0
        ? Math.round((data.currentTime / data.duration) * 100)
        : 0;

    /*
    ------------------------------
    VIDEO HISTORY
    ------------------------------
    */

    let videoHistory = await this.videoHistoryModel.findOne({
      userId: user.userId,
      lessonId,
    });

    if (!videoHistory) {
      videoHistory = await this.videoHistoryModel.create({
        userId: user.userId,
        lessonId,
        courseId: lesson.courseId,
        currentTime: data.currentTime,
        videoDuration: data.duration,
        lastWatchedAt: new Date(),
        quality: data.quality || '720p',
        isSubtitlesEnabled: data.isSubtitlesEnabled || false,
        watchRate: data.watchRate || 1,
        isCompleted: watchedPercentage >= 95,
      });
    } else {
      videoHistory.currentTime = data.currentTime;

      videoHistory.videoDuration = data.duration;

      videoHistory.lastWatchedAt = new Date();

      videoHistory.isCompleted = watchedPercentage >= 95;

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
            currentTime: data.currentTime,
            duration: data.duration,
            watchedPercentage,
            lastUpdated: new Date(),
          },

          lastAccessedAt: new Date(),

          isCompleted: watchedPercentage >= 95,

          completedAt: watchedPercentage >= 95 ? new Date() : null,
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
      message: 'Video progress saved',
      videoHistory,
    };
  }

  async getVideoProgress(lessonId: string, user: any) {
    const videoHistory = await this.videoHistoryModel.findOne({
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
  VIDEO HISTORY & COMPLETION TRACKING
  ============================================================
  */

  async updateVideoProgress(lessonId: string, progressData: any, user: any) {
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    let videoHistory = await this.videoHistoryModel.findOne({
      userId: user.userId,
      lessonId,
    });

    if (!videoHistory) {
      // Create new record if none exists
      videoHistory = await this.videoHistoryModel.create({
        userId: user.userId,
        lessonId,
        courseId: lesson.courseId,
        currentTime: progressData.currentTime || 0,
        videoDuration: progressData.duration || 0,
        lastWatchedAt: new Date(),
        isCompleted: progressData.isCompleted || false,
        completedAt: progressData.isCompleted ? new Date() : undefined,
      });
      console.log('🎯 Created new video history record:', videoHistory);
    } else {
      // Update ONLY IF new currentTime > saved currentTime (prevent overwriting higher progress)
      const newCurrentTime = progressData.currentTime || 0;
      const savedCurrentTime = videoHistory.currentTime || 0;
      
      if (newCurrentTime > savedCurrentTime) {
        videoHistory.currentTime = newCurrentTime;
        videoHistory.videoDuration = progressData.duration || videoHistory.videoDuration;
        videoHistory.lastWatchedAt = new Date();
        
        // Update completion status
        if (progressData.isCompleted && !videoHistory.isCompleted) {
          videoHistory.isCompleted = true;
          videoHistory.completedAt = new Date();
        }
        
        await videoHistory.save();
        console.log('🎯 Updated video history with higher progress:', { 
          oldTime: savedCurrentTime, 
          newTime: newCurrentTime 
        });
      } else {
        console.log('🎯 Skipping update - new progress is not higher:', { 
          savedTime: savedCurrentTime, 
          newTime: newCurrentTime 
        });
      }
    }

    return {
      message: 'Video progress updated successfully',
      videoHistory,
      currentTime: videoHistory.currentTime,
      isCompleted: videoHistory.isCompleted,
    };
  }

  async getStudentCompletions(trainer: any) {
    try {
      console.log("🎯 STEP 1 - Trainer:", trainer.userId);
      
      // Validate trainer input
      if (!trainer || !trainer.userId) {
        throw new Error('Invalid trainer data');
      }
      
      // Get all courses taught by this trainer
      const trainerCourses = await this.courseModel.find({ trainerId: trainer.userId }).lean();
      const courseIds = trainerCourses?.map(course => course._id.toString()) || [];

      console.log("🎯 STEP 2 - Courses:", trainerCourses.length);
      console.log("🎯 STEP 3 - Course IDs:", courseIds);

      // If no courses found, return empty results
      if (courseIds.length === 0) {
        console.log('🎯 No courses found for this trainer');
        return {
          studentCompletions: [],
          studentProgressData: [],
          courseAnalytics: {},
          studentAnalytics: {}
        };
      }

      // 🔥 UDEMY-STYLE AGGREGATION - Single query replaces 6 APIs
      const [enrollments, progressRecords, lessons, certificates] = await Promise.allSettled([
        // PRIMARY: Enrollments with progress (LMS standard) - FIXED populate paths
        this.enrollmentModel
          .find({ course: { $in: courseIds } })
          .populate('user', 'name email')
          .populate('course', 'title thumbnail')
          .lean(),
        
        // SECONDARY: Progress records for lesson-level analytics
        this.progressModel
          .find({ courseId: { $in: courseIds } })
          .populate('userId', 'name email')
          .populate('lessonId', 'title')
          .sort({ lastAccessedAt: -1 })
          .lean(),
        
        // REFERENCE: Lessons for completion calculations
        this.lessonModel.find({ courseId: { $in: courseIds } }).lean(),
        
        // VERIFICATION: Certificates for completion confirmation
        this.certificateModel
          .find({ courseId: { $in: courseIds } })
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .lean()
      ]);

      // Extract results safely
      const enrollmentsData = enrollments.status === 'fulfilled' ? enrollments.value : [];
      const progressRecordsData = progressRecords.status === 'fulfilled' ? progressRecords.value : [];
      const lessonsData = lessons.status === 'fulfilled' ? lessons.value : [];
      const certificatesData = certificates.status === 'fulfilled' ? certificates.value : [];

      console.log("🎯 DATA SOURCES - LMS Standard:", {
        enrollments: enrollmentsData.length,
        progressRecords: progressRecordsData.length,
        lessons: lessonsData.length,
        certificates: certificatesData.length
      });

      // 🔥 PRODUCTION ANALYTICS - Calculate completions using enrollment.progress (LMS standard)
      const studentCompletions: any[] = [];
      const studentProgressData: any[] = [];

      // Process each course for completion analytics
      for (const course of trainerCourses) {
        const courseId = course._id.toString();
        
        // Get all enrollments for this course
        const courseEnrollments = enrollmentsData.filter(e => 
          (e.course as any)?._id?.toString() === courseId || e.course?.toString() === courseId
        );
        
        // Get all lessons for this course
        const courseLessons = lessonsData.filter(l => l.courseId.toString() === courseId);
        const totalLessons = courseLessons.length;
        
        // 🔥 COMPLETION CALCULATION - Use enrollment.progress (LMS standard)
        const completedStudents = courseEnrollments.filter(e => 
          e.progress >= 100 || e.status === 'completed'
        );
        const activeStudents = courseEnrollments.filter(e => 
          e.status === 'active' && e.progress > 0 && e.progress < 100
        );
        
        // Calculate average progress from enrollments
        const averageProgress = courseEnrollments.length > 0 
          ? courseEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / courseEnrollments.length 
          : 0;
        
        // Calculate completion rate
        const completionRate = courseEnrollments.length > 0 
          ? (completedStudents.length / courseEnrollments.length) * 100 
          : 0;

        // Get progress records for detailed analytics
        const courseProgressRecords = progressRecordsData.filter(p => p.courseId.toString() === courseId);
        
        // Create progress breakdown per student
        const progressBreakdown = courseEnrollments.map(enrollment => {
          const studentId = (enrollment.user as any)?._id?.toString() || enrollment.user?.toString();
          const studentProgressRecords = courseProgressRecords.filter(p => 
            (p.userId as any)?._id?.toString() === studentId
          );
          const lessonsCompleted = studentProgressRecords.filter(p => p.isCompleted).length;
          
          return {
            studentId,
            studentName: (enrollment.user as any)?.name || 'Unknown',
            studentEmail: (enrollment.user as any)?.email || 'unknown@email.com',
            lessonsCompleted,
            totalLessons,
            completionRate: totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0,
            lastAccessed: (enrollment as any).updatedAt || (enrollment as any).createdAt || studentProgressRecords[0]?.lastAccessedAt,
            progress: enrollment.progress || 0 // 🔥 Use enrollment.progress
          };
        }).sort((a, b) => b.completionRate - a.completionRate);

        // Create recent activity feed
        const recentActivity = courseProgressRecords
          .filter(p => p.lastAccessedAt)
          .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
          .slice(0, 5)
          .map(p => ({
            studentId: (p.userId as any)?._id?.toString(),
            studentName: (p.userId as any)?.name || 'Unknown',
            activity: p.lastAccessedAt,
            lessonTitle: (p.lessonId as any)?.title || 'Unknown Lesson',
            isCompleted: p.isCompleted
          }));

        // Create lesson progress analytics
        const lessonProgress: any = {};
        courseLessons.forEach(lesson => {
          const lessonId = lesson._id.toString();
          const lessonRecords = courseProgressRecords.filter(p => p.lessonId.toString() === lessonId);
          const completedCount = lessonRecords.filter(p => p.isCompleted).length;
          const inProgressCount = lessonRecords.filter(p => !p.isCompleted && p.completionPercentage > 0).length;
          
          lessonProgress[lessonId] = {
            lessonTitle: lesson.title,
            completedStudents: lessonRecords.filter(p => p.isCompleted).map(p => (p.userId as any)?._id?.toString()),
            inProgressStudents: lessonRecords.filter(p => !p.isCompleted && p.completionPercentage > 0).map(p => (p.userId as any)?._id?.toString()),
            completionRate: lessonRecords.length > 0 ? (completedCount / lessonRecords.length) * 100 : 0,
            totalAttempts: lessonRecords.length
          };
        });

        // 🔥 COURSE COMPLETION DATA - LMS Standard Structure
        const courseCompletionData = {
          courseId: courseId,
          courseTitle: course.title,
          courseThumbnail: course.thumbnail,
          totalEnrolled: courseEnrollments.length,
          activeStudents: activeStudents.length,
          completedStudents: completedStudents.length,
          totalCompletions: progressBreakdown.reduce((sum, student) => sum + student.lessonsCompleted, 0),
          averageProgress: Math.round(averageProgress),
          completionRate: Math.round(completionRate),
          totalLessons: totalLessons,
          progressBreakdown,
          lessonProgress,
          recentActivity,
          // 🔥 LMS Standard Fields
          enrollmentProgressData: courseEnrollments.map(e => ({
            studentId: (e.user as any)?._id?.toString(),
            progress: e.progress || 0,
            status: e.status || 'active',
            lastAccessed: (e as any).updatedAt || (e as any).createdAt
          }))
        };

        studentCompletions.push(courseCompletionData);
        
        console.log(`🎯 Course ${course.title} Analytics:`, {
          enrolled: courseEnrollments.length,
          completed: completedStudents.length,
          completionRate: Math.round(completionRate) + '%',
          avgProgress: Math.round(averageProgress) + '%'
        });
      }

      // 🔥 STUDENT ANALYTICS - Per-student view across all courses
      const studentMap = new Map();
      
      enrollmentsData.forEach(enrollment => {
        const studentId = (enrollment.user as any)?._id?.toString() || enrollment.user?.toString();
        
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            studentId,
            studentName: (enrollment.user as any)?.name || 'Unknown',
            studentEmail: (enrollment.user as any)?.email || 'unknown@email.com',
            totalCoursesEnrolled: 0,
            totalCoursesCompleted: 0,
            overallProgress: 0,
            lastActivity: null,
            courseProgress: {}
          });
        }
        
        const student = studentMap.get(studentId);
        student.totalCoursesEnrolled++;
        
        const courseId = (enrollment.course as any)?._id?.toString() || enrollment.course?.toString();
        student.courseProgress[courseId] = {
          progress: enrollment.progress || 0,
          status: enrollment.status || 'active',
          lastAccessed: (enrollment as any).updatedAt || (enrollment as any).createdAt,
          isCompleted: enrollment.progress >= 100 || enrollment.status === 'completed'
        };
        
        if (enrollment.progress >= 100 || enrollment.status === 'completed') {
          student.totalCoursesCompleted++;
        }
        
        if ((enrollment as any).updatedAt && (!student.lastActivity || (enrollment as any).updatedAt > student.lastActivity)) {
          student.lastActivity = (enrollment as any).updatedAt;
        }
      });

      // Calculate overall progress per student
      studentMap.forEach(student => {
        const courseProgressValues = Object.values(student.courseProgress).map((cp: any) => cp.progress || 0);
        student.overallProgress = courseProgressValues.length > 0 
          ? courseProgressValues.reduce((sum, progress) => sum + progress, 0) / courseProgressValues.length 
          : 0;
        
        studentProgressData.push(student);
      });

      console.log('🎯 FINAL LMS ANALYTICS:', {
        totalCourses: studentCompletions.length,
        totalStudents: studentProgressData.length,
        totalEnrollments: enrollmentsData.length,
        avgCompletionRate: studentCompletions.length > 0 
          ? Math.round(studentCompletions.reduce((sum, course) => sum + course.completionRate, 0) / studentCompletions.length)
          : 0
      });

      return {
        studentCompletions, // Per-course analytics
        studentProgressData, // Per-student analytics
        totalStudentCompletions: progressRecordsData.filter(p => p.isCompleted).length,
        totalCourses: studentCompletions.length,
        totalStudents: studentProgressData.length,
        totalEnrollments: enrollmentsData.length,
        averageCompletionRate: studentCompletions.length > 0 
          ? Math.round(studentCompletions.reduce((sum, course) => sum + course.completionRate, 0) / studentCompletions.length)
          : 0
      };
      
    } catch (error) {
      console.error('🎯 Error in getStudentCompletions:', error);
      throw new Error(`Failed to fetch student completions: ${error.message}`);
    }
  }

  async getCourseProgress(courseId: string, user: any) {
    try {
      // Get enrollment for this course and user
      const enrollment = await this.enrollmentModel.findOne({
        user: user.userId,
        course: courseId
      }).populate('course').populate('user');

      if (!enrollment) {
        return {
          success: false,
          message: 'Enrollment not found'
        };
      }

      // Get all lessons for this course
      const lessons = await this.lessonModel.find({ courseId });
      
      // Get progress records for this user and course
      const progressRecords = await this.progressModel.find({
        courseId,
        userId: user.userId
      }).populate('lessonId');

      // Calculate progress
      const totalLessons = lessons.length;
      const completedLessons = progressRecords.filter(p => p.isCompleted).length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        success: true,
        data: {
          enrollment,
          totalLessons,
          completedLessons,
          progressPercentage,
          lessons: lessons.map(lesson => {
            const progress = progressRecords.find(p => p.lessonId.toString() === lesson._id.toString());
            return {
              lesson,
              isCompleted: progress?.isCompleted || false,
              completionPercentage: progress?.completionPercentage || 0,
              lastAccessed: progress?.lastAccessedAt
            };
          })
        }
      };
    } catch (error) {
      throw new Error(`Failed to get course progress: ${error.message}`);
    }
  }

  async getCompletedCourses(user: any) {
    try {
      // Get all enrollments for this user
      const enrollments = await this.enrollmentModel.find({
        user: user.userId
      }).populate('course').populate('user');

      // Filter for completed courses (progress >= 100%)
      const completedEnrollments = enrollments.filter(enrollment => {
        return enrollment.progress >= 100;
      });

      return {
        success: true,
        data: {
          completedCourses: completedEnrollments.map(enrollment => ({
            enrollment,
            course: enrollment.course,
            completedAt: (enrollment as any).updatedAt // Assuming this is when it was completed
          })),
          totalCompleted: completedEnrollments.length
        }
      };
    } catch (error) {
      throw new Error(`Failed to get completed courses: ${error.message}`);
    }
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

  private async generateCertificate(courseId: string, userId: string) {
    const existing = await this.certificateModel.findOne({
      courseId,
      userId,
    });

    if (existing) return;

    // Get course and user details
    const [course, user] = await Promise.all([
      this.courseModel.findById(courseId).populate('trainerId', 'name'),
      this.userModel.findById(userId)
    ]);

    await this.certificateModel.create({
      certificateId: 'CERT-' + Date.now(),
      userId,
      courseId,
      completionDate: new Date(),
      studentName: user?.name || 'Student',
      courseName: course?.title || 'Course',
      trainerName: (course?.trainerId as any)?.name || 'Trainer',
      isApproved: false,
    });
  }

  /*
  ============================================================
  COURSE PROGRESS CALCULATION
  ============================================================
  */

  private async calculateCourseProgress(courseId: string, userId: string) {
    const total = await this.lessonModel.countDocuments({
      courseId,
      isPublished: true
    });

    const completed = await this.progressModel.countDocuments({
      courseId,
      userId,
      isCompleted: true
    });

    const percent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    await this.enrollmentModel.updateOne(
      { user: userId, course: courseId },
      { 
        progress: percent,
        status: percent === 100 ? 'completed' : 'active'
      }
    );

    // Safe certificate generation
    if (percent === 100) {
      await this.generateCertificateIfNotExists(courseId, userId);
    }
  }

  private async generateCertificateIfNotExists(courseId: string, userId: string) {
    const existing = await this.certificateModel.findOne({
      courseId,
      userId,
    });

    if (existing) {
      console.log(`🎓 Certificate already exists for user ${userId} in course ${courseId}`);
      return;
    }

    console.log(`🎓 Generating certificate for user ${userId} in course ${courseId}`);

    // Get course and user details
    const [course, user] = await Promise.all([
      this.courseModel.findById(courseId).populate('trainerId', 'name'),
      this.userModel.findById(userId)
    ]);

    if (!course || !user) {
      console.error(`❌ Cannot generate certificate - Course: ${!!course}, User: ${!!user}`);
      return;
    }

    await this.certificateModel.create({
      certificateId: 'CERT-' + Date.now(),
      userId,
      courseId,
      completionDate: new Date(),
      studentName: user?.name || 'Student',
      courseName: course?.title || 'Course',
      trainerName: (course?.trainerId as any)?.name || 'Trainer',
      isApproved: false,
    });

    console.log(`✅ Certificate generated successfully for user ${userId} in course ${courseId}`);
  }
}

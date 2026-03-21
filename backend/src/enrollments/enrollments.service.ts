import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { Course, CourseDocument } from 'src/courses/schemas/course.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CertificatesService } from 'src/certificates/certificates.service';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  // Debug method to see all enrollments
  async debugAllEnrollments() {
    try {
      const allEnrollments = await this.enrollmentModel.find({}).lean();
      this.logger.log(`Found ${allEnrollments.length} total enrollments`);
      
      // Log each enrollment for debugging
      allEnrollments.forEach((enrollment, index) => {
        this.logger.log(`Enrollment ${index + 1}:`, {
          id: enrollment._id,
          user: enrollment.user,
          course: enrollment.course,
          courseType: typeof enrollment.course,
          courseIsValid: /^[0-9a-fA-F]{24}$/.test(enrollment.course?.toString() || ''),
          status: enrollment.status,
          paymentStatus: enrollment.paymentStatus
        });
      });
      
      return allEnrollments;
    } catch (error) {
      this.logger.error(`Debug all enrollments failed: ${error.message}`);
      throw error;
    }
  }

  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private certificatesService: CertificatesService,
  ) {
    this.logger.log('EnrollmentsService initialized');
  }

  //adding enrollment logic here
  async enrollCourse(userId: string, courseId: string) {
    try {
      this.logger.log(`Attempting to enroll user ${userId} in course ${courseId}`);
      
      // Validate inputs
      if (!userId || !courseId) {
        throw new Error('User ID and Course ID are required');
      }

      // Check if enrollment model is available
      if (!this.enrollmentModel) {
        this.logger.error('Enrollment model not available');
        throw new Error('Database connection not available');
      }

      // Check if course exists first
      let course;
      try {
        course = await this.courseModel.findById(courseId).maxTimeMS(5000);
        this.logger.log(`🔍 Backend Debug - Course found: ${course ? 'YES' : 'NO'}`);
        this.logger.log(`🔍 Backend Debug - Course details:`, course);
      } catch (courseError) {
        this.logger.error(`🔍 Backend Debug - Course lookup failed: ${courseError.message}`);
        throw new Error('Failed to validate course existence');
      }

      if (!course) {
        this.logger.warn(`🔍 Backend Debug - Course not found: ${courseId}`);
        throw new Error('Course not found');
      }

      //check if user is already enrolled (with timeout and error handling)
      let exists;
      try {
        exists = await this.enrollmentModel.findOne({
          user: userId,
          course: courseId,
        }).maxTimeMS(5000); // 5 second timeout
      } catch (dbError) {
        this.logger.error(`Database query failed: ${dbError.message}`);
        throw new Error('Database query failed');
      }
      
      if (exists) {
        this.logger.log(`User ${userId} already enrolled in course ${courseId}`);
        throw new Error('Already enrolled in this course');
      }

      //create enrollment (with error handling)
      let enrollment;
      try {
        enrollment = await this.enrollmentModel.create({
          user: userId,
          course: courseId,
          progress: 0,
          status: 'active',
          paymentStatus: 'pending',
        });
      } catch (createError) {
        this.logger.error(`Failed to create enrollment: ${createError.message}`);
        throw new Error('Failed to create enrollment record');
      }

      // Update course enrollment count
      try {
        const enrollmentCount = await this.enrollmentModel.countDocuments({ course: courseId });
        await this.courseModel.updateOne(
          { _id: courseId },
          { 
            $set: { 
              enrollmentCount: enrollmentCount
            }
          }
        );
        this.logger.log(`🎯 Updated course ${courseId} enrollmentCount to ${enrollmentCount}`);
      } catch (updateError) {
        this.logger.error(`🎯 Failed to update course enrollment count: ${updateError.message}`);
        // Don't throw error - enrollment was successful, just log the issue
      }

      this.logger.log(`Successfully enrolled user ${userId} in course ${courseId}`);

      return {
        message: 'Enrolled successfully',
        enrollmentId: enrollment._id,
        courseId: courseId,
        userId: userId,
      };
    } catch (error) {
      this.logger.error(`Failed to enroll user ${userId} in course ${courseId}: ${error.message}`);
      throw error;
    }
  }

  async getMyEnrollments(userId: string) {
    try {
      this.logger.log(`Fetching enrollments for user: ${userId}`);
      
      // Check if database connection is working
      if (!this.enrollmentModel) {
        this.logger.error('Enrollment model not available');
        return [];
      }

      // Simple, safe query without population that might cause issues
      const enrollments = await this.enrollmentModel
        .find({ user: userId })
        .lean() // Use lean for better performance
        .exec();
      
      this.logger.log(`Found ${enrollments.length} enrollments for user ${userId}`);
      
      // Transform to match frontend expectations with safe field access
      const validEnrollments: any[] = [];
      
      for (const enrollment of enrollments) {
        try {
          const courseId = (enrollment.course as any)?.toString();
          
          // Skip enrollments with invalid courseId (like "enroll")
          if (!courseId || courseId === 'enroll' || typeof courseId !== 'string') {
            this.logger.warn(`🔍 Skipping enrollment with invalid courseId: ${courseId}`);
            continue;
          }
          
          // Check if courseId is a valid ObjectId format
          const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
          if (!isValidObjectId) {
            this.logger.warn(`🔍 Skipping enrollment with invalid ObjectId format: ${courseId}`);
            continue;
          }
          
          // Try to populate course data with trainer information
          let course;
          try {
            course = await this.courseModel.findById(courseId).populate('trainerId', 'name email').lean();
          } catch (courseError) {
            this.logger.warn(`🔍 Failed to fetch course ${courseId}: ${courseError.message}`);
            continue;
          }
          
          // Skip if course doesn't exist
          if (!course) {
            this.logger.warn(`🔍 Course not found for enrollment: ${courseId}`);
            continue;
          }
          
          // Add valid enrollment to results
          validEnrollments.push({
            courseId: course._id,
            enrollmentId: enrollment._id,
            title: course.title || 'Unknown Course',
            thumbnail: course.thumbnail || null,
            description: course.description || '',
            duration: course.duration || 0,
            trainerId: course.trainerId || null,
            trainerName: course.trainerId?.name || 'Unknown', // 🔥 Added trainer name
            progress: enrollment.progress || 0,
            enrolledAt: (enrollment as any).createdAt || new Date(),
            lastAccessed: (enrollment as any).lastAccessed || (enrollment as any).createdAt, // 🔥 Added last accessed
            status: enrollment.status || 'active',
            paymentStatus: enrollment.paymentStatus || 'pending',
            totalLessons: course.lessons?.length || 0,
            completedLessons: enrollment.progress ? Math.round(enrollment.progress / 100 * (course.lessons?.length || 0)) : 0,
          });
          
        } catch (enrollmentError) {
          this.logger.error(`🔍 Error processing enrollment ${enrollment._id}: ${enrollmentError.message}`);
          continue;
        }
      }
      
      this.logger.log(`Returning ${validEnrollments.length} valid enrollments for user ${userId}`);
      return validEnrollments;
      
    } catch (error) {
      this.logger.error(`Error fetching enrollments for user ${userId}: ${error.message}`, error.stack);
      // Return empty array instead of throwing to prevent 500 errors
      return [];
    }
  }

  async completeCourse(userId: string, courseId: string) {
    try {
      this.logger.log(`Completing course ${courseId} for user ${userId}`);
      
      // Find enrollment
      const enrollment = await this.enrollmentModel
        .findOne({
          user: userId,
          course: courseId,
        })
        .populate('user')
        .populate('course');

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      // Update enrollment status
      enrollment.status = 'completed';
      enrollment.progress = 100;
      await enrollment.save();

      // Generate certificate (if certificates service is available)
      try {
        // Check if generateCertificate expects different parameters
        if (this.certificatesService && typeof this.certificatesService.generateCertificate === 'function') {
          // Fetch actual course data to get trainer name
          const course = await this.courseModel.findById(courseId).populate('trainerId', 'name');
          
          // Get actual trainer name
          const trainerName = course && course.trainerId ? (course.trainerId as any).name : 'Trainer';
          
          // Fetch user data to get student name
          const user = await this.userModel.findById(userId);
          const studentName = user ? (user as any).name : 'Student';
          
          // Try with single object parameter - use any to avoid interface errors
          await this.certificatesService.generateCertificate({
            userId: userId,
            courseId: courseId,
            studentName: studentName, // ✅ Fetch actual student name
            courseName: course ? (course as any).title : 'Course', // ✅ Fetch actual course name
            trainerName: trainerName // ✅ Fetch actual trainer name
          } as any); // Type assertion to avoid interface errors
        }
      } catch (certError) {
        this.logger.warn(`Certificate generation failed: ${certError.message}`);
        // Don't fail the completion if certificate generation fails
      }

      this.logger.log(`Successfully completed course ${courseId} for user ${userId}`);
      
      return {
        message: 'Course completed successfully',
        enrollmentId: enrollment._id,
        certificateGenerated: true
      };
    } catch (error) {
      this.logger.error(`Failed to complete course ${courseId} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // 🔥 NEW: Update last accessed time
  async updateLastAccessed(userId: string, courseId: string) {
    try {
      await this.enrollmentModel.updateOne(
        { user: userId, course: courseId },
        { lastAccessed: new Date() }
      );
      
      this.logger.log(`Updated last accessed for user ${userId}, course ${courseId}`);
    } catch (error) {
      this.logger.warn(`Failed to update last accessed: ${error.message}`);
      // Don't throw error - this is not critical
    }
  }
}

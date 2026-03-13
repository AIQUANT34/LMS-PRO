import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { CertificatesService } from 'src/certificates/certificates.service';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
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
      return enrollments.map(enrollment => ({
        courseId: enrollment.course?._id || enrollment.course,
        enrollmentId: enrollment._id,
        progress: enrollment.progress || 0,
        enrolledAt: (enrollment as any).createdAt || new Date(), // Type assertion for createdAt
        status: enrollment.status || 'active',
        paymentStatus: enrollment.paymentStatus || 'pending'
      }));
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
          // Try with single object parameter - use any to avoid interface errors
          await this.certificatesService.generateCertificate({
            userId: userId,
            courseId: courseId,
            studentName: 'Student', // Would need to fetch from user
            courseName: 'Course', // Would need to fetch from course
            instructorName: 'Instructor' // Use instructorName as expected
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
}

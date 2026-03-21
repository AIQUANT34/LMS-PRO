import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InstructorApplication, InstructorApplicationDocument } from './schemas/instructor-application.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(InstructorApplication.name)
    private instructorApplicationModel: Model<InstructorApplicationDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(data: any) {
    return this.userModel.create(data);
  }

  async applyTrainer(userId: string, applicationData: any) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'student') {
      throw new Error('Only students can apply');
    }

    // Check if application already exists
    const existingApplication = await this.instructorApplicationModel.findOne({
      userId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      throw new Error('You already have a pending or approved application');
    }

    // Create instructor application
    const application = new this.instructorApplicationModel({
      ...applicationData,
      userId,
      email: user.email, // Ensure email matches user's email
      status: 'pending',
    });

    await application.save();

    // Update user's trainerRequest status
    user.trainerRequest = 'pending';
    await user.save();

    return {
      message: 'Trainer application submitted successfully! We\'ll review it within 5-7 business days.',
      applicationId: application._id,
    };
  }

  async getTrainerApplication(userId: string, requestingUserId: string) {
    // Users can only view their own applications
    if (userId !== requestingUserId) {
      throw new Error('Unauthorized');
    }

    const application = await this.instructorApplicationModel
      .findOne({ userId })
      .populate('reviewedBy', 'name email')
      .exec();

    if (!application) {
      throw new Error('No application found');
    }

    return application;
  }

  async reviewTrainerApplication(
    applicationId: string,
    reviewData: { status: string; rejectionReason?: string; adminNotes?: any },
    adminId: string
  ) {
    const application = await this.instructorApplicationModel.findById(applicationId);

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'pending') {
      throw new Error('Application has already been reviewed');
    }

    // Update application
    application.status = reviewData.status;
    application.reviewedBy = new Types.ObjectId(adminId);
    application.reviewedAt = new Date();
    
    if (reviewData.rejectionReason) {
      application.rejectionReason = reviewData.rejectionReason;
    }
    
    if (reviewData.adminNotes) {
      application.adminNotes = reviewData.adminNotes;
    }

    await application.save();

    // Update user's role if approved
    if (reviewData.status === 'approved') {
      await this.userModel.findByIdAndUpdate(application.userId, {
        role: 'trainer',
        trainerRequest: 'approved',
        isVerifiedTrainer: true,
      });
    } else if (reviewData.status === 'rejected') {
      await this.userModel.findByIdAndUpdate(application.userId, {
        trainerRequest: 'rejected',
      });
    }

    return {
      message: `Application ${reviewData.status} successfully`,
      application,
    };
  }

  async getAllTrainerApplications() {
    return this.instructorApplicationModel
      .find()
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllUsers() {
    return this.userModel
      .find()
      .select('-password') // Exclude password from results
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async updateProfilePicture(userId: string, profilePictureUrl: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { avatar: profilePictureUrl },
      { returnDocument: 'after' }
    ).select('-password').exec();
  }

  async changePassword(userId: string, passwordData: { currentPassword: string; newPassword: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password (you'll need to implement password comparison)
    const isCurrentPasswordValid = await this.comparePasswords(passwordData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(passwordData.newPassword);

    // Update password and lastPasswordChange
    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        password: hashedNewPassword,
        lastPasswordChange: new Date()
      },
      { returnDocument: 'after' }
    ).select('-password').exec();
  }

  // Helper methods (you'll need to implement these based on your password hashing)
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Implement password comparison logic
    // This depends on your password hashing method (bcrypt, etc.)
    return true; // Placeholder - implement actual comparison
  }

  private async hashPassword(password: string): Promise<string> {
    // Implement password hashing logic
    // This depends on your password hashing method (bcrypt, etc.)
    return password; // Placeholder - implement actual hashing
  }

  async verifyTrainer(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isVerifiedTrainer: true },
      { returnDocument: 'after' },
    );
  }
}

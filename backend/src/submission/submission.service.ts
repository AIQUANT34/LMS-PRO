import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
  ) {}

  async submitAssignment(submitData: any, user: any) {
    const submission = await this.submissionModel.create({
      ...submitData,
      studentId: user.userId,
      submittedAt: new Date(),
      status: 'submitted',
    });

    return submission;
  }

  async getMySubmission(assignmentId: string, user: any) {
    const submission = await this.submissionModel
      .findOne({ assessmentId: assignmentId, studentId: user.userId })
      .populate('assessmentId', 'title points dueDate')
      .populate('studentId', 'name email')
      .exec();

    return submission;
  }

  async getCourseSubmissions(courseId: string, _user: any) {
    const submissions = await this.submissionModel
      .find({ courseId })
      .populate('assessmentId', 'title points dueDate')
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 })
      .exec();

    return submissions;
  }

  async gradeSubmission(submissionId: string, gradeData: any, _user: any) {
    const submission = await this.submissionModel.findById(submissionId);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if user is authorized to grade (instructor or admin)
    // This would require checking if user is instructor of the course

    const gradedSubmission = await this.submissionModel.findByIdAndUpdate(
      submissionId,
      {
        ...gradeData,
        reviewedBy: _user.userId,
        reviewedAt: new Date(),
        status: 'reviewed',
      },
      { new: true },
    );

    return gradedSubmission;
  }

  async getSubmissionById(submissionId: string, user: any) {
    const submission = await this.submissionModel
      .findById(submissionId)
      .populate('assessmentId', 'title points dueDate')
      .populate('studentId', 'name email')
      .populate('reviewedBy', 'name email')
      .exec();

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if user is authorized to view this submission
    // Student can only view their own submissions
    // Instructor can view submissions for their courses

    return submission;
  }

  async updateSubmission(submissionId: string, updateData: any, user: any) {
    const submission = await this.submissionModel.findById(submissionId);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.studentId.toString() !== user.userId) {
      throw new ForbiddenException('Not authorized to update this submission');
    }

    const updatedSubmission = await this.submissionModel.findByIdAndUpdate(
      submissionId,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    );

    return updatedSubmission;
  }

  async deleteSubmission(submissionId: string, user: any) {
    const submission = await this.submissionModel.findById(submissionId);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.studentId.toString() !== user.userId) {
      throw new ForbiddenException('Not authorized to delete this submission');
    }

    await this.submissionModel.findByIdAndDelete(submissionId);
    return { message: 'Submission deleted successfully' };
  }

  // Assessment-related methods for compatibility
  async getAssessmentsByCourse(courseId: string, user: any) {
    // This would return assessments for a course
    // For now, return empty array as assessments are handled by assessments module
    return [];
  }

  async submitAssessment(assessmentId: string, dto: any, user: any) {
    // This submits an assessment (quiz/test)
    return this.submitAssignment(
      {
        assessmentId,
        ...dto,
      },
      user,
    );
  }

  async reviewSubmission(submissionId: string, reviewData: any, user: any) {
    return this.gradeSubmission(submissionId, reviewData, user);
  }

  async getAssessmentSubmissions(assessmentId: string, user: any) {
    const submissions = await this.submissionModel
      .find({ assessmentId })
      .populate('assessmentId', 'title points dueDate')
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 })
      .exec();

    return submissions;
  }
}

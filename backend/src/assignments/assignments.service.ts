import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
  ) {}

  async getAssignment(assignmentId: string, user: any) {
    const assignment = await this.assignmentModel
      .findById(assignmentId)
      .populate('courseId', 'title')
      .populate('trainerId', 'name')
      .exec();

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async createAssignment(assignmentData: any, user: any) {
    const assignment = await this.assignmentModel.create({
      ...assignmentData,
      trainerId: user.userId,
      createdAt: new Date(),
    });

    return assignment;
  }

  async getCourseAssignments(courseId: string, user: any) {
    const assignments = await this.assignmentModel
      .find({ courseId })
      .populate('trainerId', 'name')
      .sort({ createdAt: -1 })
      .exec();

    return assignments;
  }

  async getTrainerAssignments(user: any) {
    const assignments = await this.assignmentModel
      .find({ trainerId: user.userId })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .exec();

    return {
      assignments,
      count: assignments.length,
    };
  }

  async updateAssignment(assignmentId: string, updateData: any, user: any) {
    const assignment = await this.assignmentModel.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.trainerId.toString() !== user.userId) {
      throw new ForbiddenException('Not authorized to update this assignment');
    }

    const updatedAssignment = await this.assignmentModel.findByIdAndUpdate(
      assignmentId,
      { ...updateData, updatedAt: new Date() },
      { returnDocument: 'after' },
    );

    return updatedAssignment;
  }

  async deleteAssignment(assignmentId: string, user: any) {
    const assignment = await this.assignmentModel.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.trainerId.toString() !== user.userId) {
      throw new ForbiddenException('Not authorized to delete this assignment');
    }

    await this.assignmentModel.findByIdAndDelete(assignmentId);
    return { message: 'Assignment deleted successfully' };
  }
}

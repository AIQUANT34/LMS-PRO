import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Assessment, AssessmentDocument } from './schemas/assessment.schema';

import {
  Submission,
  SubmissionDocument
} from '../submission/schemas/submission.schema';

import {
  SubmitAssessmentDto,
  ReviewSubmissionDto
} from './dto/submission.dto';

@Injectable()
export class AssessmentsService {

  constructor(

    @InjectModel(Assessment.name)
    private assessmentModel: Model<AssessmentDocument>,

    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,

  ) {}

  async getAssessmentsByCourse(courseId: string, user: any){

    const assessments = await this.assessmentModel.find({
        courseId,
        status: 'published'

    }).sort({ createdAt: -1})

    return{
        assessments
    };
  }


  async submitAssessment(
  assessmentId: string,
  dto: SubmitAssessmentDto,
  user: any
) {

  // Check assessment exists
  const assessment = await this.assessmentModel.findById(assessmentId);

  if (!assessment) {
    throw new NotFoundException('Assessment not found');
  }

  if (assessment.status !== 'published') {
    throw new BadRequestException('Assessment not published');
  }

  // Prevent duplicate submission
  const existingSubmission = await this.submissionModel.findOne({
    assessmentId,
    studentId: user.userId
  });

  if (existingSubmission) {
    throw new BadRequestException('Already submitted');
  }

  // Create submission
  const submission = await this.submissionModel.create({

    assessmentId,

    studentId: user.userId,

    fileUrl: dto.fileUrl,

    textAnswer: dto.textAnswer,

    status: 'submitted',

  });

  return {
    message: 'Assessment submitted successfully',
    submission,
  };

}


async getMySubmission(
    assessmentId: string,
    user: any
){
    const submission = await this.submissionModel.findOne({
        assessmentId,
        studentId: user.userId
    })

    if(!submission){
        return {
            submission: null,
            message: 'No submission yet'
        }
    }
    return {
        submission
    }
}


async reviewSubmission(
  submissionId: string,
  dto: ReviewSubmissionDto,
  user: any
) {

const submission = await this.submissionModel.findById(submissionId)
    .populate('assessmentId');

  if (!submission) {
    throw new NotFoundException('Submission not found');
  }

  const assessment: any = submission.assessmentId;

  // Only instructor of the course can review
  if (assessment.instructorId.toString() !== user.userId) {
    throw new ForbiddenException('Only instructor can review submissions');
  }

  if (submission.status === 'graded') {
    throw new BadRequestException('Submission already reviewed');
  }

  submission.score = dto.score;

  submission.feedback = dto.feedback;

  submission.status = 'graded';

  submission.reviewedAt = new Date();

  submission.reviewedBy = user.userId;

  await submission.save();

  return {
    message: 'Submission reviewed successfully',
    submission,
  };

}

 async getAssessmentSubmissions(
  assessmentId: string,
  user: any
) {

  const assessment = await this.assessmentModel.findById(assessmentId);

  if (!assessment) {
    throw new NotFoundException('Assessment not found');
  }

  // Only instructor can view submissions
  if (assessment.instructorId.toString() !== user.userId) {
    throw new ForbiddenException('Only instructor can view submissions');
  }

  const submissions = await this.submissionModel
    .find({ assessmentId })
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });

  return {
    submissions,
    count: submissions.length
  };

}


}
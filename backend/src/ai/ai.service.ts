import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios'

import { Types } from 'mongoose';

import { Model } from 'mongoose'
import { User, UserDocument } from '../users/schemas/user.schema'
import { Course, CourseDocument } from '../courses/schemas/course.schema'
import { Progress, ProgressDocument } from '../learning/schemas/progress.schema';


@Injectable()
export class AiService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,

    @InjectModel(Progress.name)
    private progressModel: Model<ProgressDocument>,
  ) {}

    async askGemini(question: string){
        const apiKey = process.env.GEMINI_API_KEY

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
     {
        contents: [
            {
              parts: [{ text: question }],
            },
        ],
      },
      {
        headers: {
            "Content-Type": 'application/json'
        },
      },
    );
    return response.data.candidates[0].content.parts[0].text;
    }


async generateStudentSummary(studentId: string, courseId: string) {
  const student = await this.userModel.findById(studentId);
  const course = await this.courseModel.findById(courseId);


const progress = await this.progressModel.findOne({
  userId: new Types.ObjectId(studentId),
  courseId: new Types.ObjectId(courseId),
  isDeleted: false,
});

  if (!student || !course || !progress) {
    throw new Error('Student, course, or progress not found');
  }

  const completionStatus = progress.isCompleted
    ? 'Completed'
    : 'In Progress';

  const prompt = `
  You are an LMS performance analyst.

  Student Name: ${student.name}
  Course: ${course.title}
  Completion Percentage: ${progress.completionPercentage}%
  Quiz Score: ${progress.quizScore ?? 0}
  Quiz Passed: ${progress.isQuizPassed ? 'Yes' : 'No'}
  Total Time Spent (seconds): ${progress.timeSpentSeconds}
  Completion Status: ${completionStatus}

  Generate a professional learning progress summary including:
  - Overall performance
  - Strengths
  - Areas to improve
  - Recommendation
  `;

  return this.askGemini(prompt);
}


async generateLearningRecommendations(studentId: string, courseId: string) {
  const student = await this.userModel.findById(studentId);
  const course = await this.courseModel.findById(courseId);
  const progress = await this.progressModel.findOne({
    userId: studentId,
    courseId: courseId,
  });

  if (!student || !course || !progress) {
    throw new Error('Student, course, or progress not found');
  }

  const prompt = `
  Student Name: ${student.name}
  Course: ${course.title}
  Completion: ${progress.completionPercentage}%
  Quiz Score: ${progress.quizScore}

  Based on this information:
  1. Suggest what the student should focus on next.
  2. Suggest improvement strategies.
  3. Suggest additional learning resources.
  Keep it professional and structured.
  `;

  return this.askGemini(prompt)
}


}

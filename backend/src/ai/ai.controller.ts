import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  @UseGuards(JwtGuard)
  async askAI(
    @Body()
    body: {
      question: string;
      courseId?: string;
      lessonId?: string;
      context?: string;
    },
    @Req() req,
  ) {
    const prompt = `
        You are an AI Tutor for Corporate Training.
        User Role: ${req.user.role}
        Course ID: ${body.courseId || 'N/A'}
        Lesson ID: ${body.lessonId || 'N/A'}
        Context: ${body.context || 'corporate_training'}

        Student Question: ${body.question}

        Provide a clear, helpful explanation with corporate training focus.
        `;
    return this.aiService.askGemini(prompt);
  }

  @Post('generate-quiz')
  @UseGuards(JwtGuard)
  async generateQuiz(
    @Body() body: { courseName: string; topic: string; context?: string },
  ) {
    const prompt = `
        You are an LMS quiz generator for Corporate Training.

        Course: ${body.courseName}
        Topic: ${body.topic}
        Context: ${body.context || 'corporate_training'}

        Generate 3 multiple choice questions with 4 options each.
        Format as JSON: { questions: [{ question, options: [A, B, C, D], correctAnswer }] }
        `;
    return this.aiService.askGemini(prompt);
  }

  @Post('progress-summary/:employeeId/:courseId')
  @UseGuards(JwtGuard)
  async getProgressSummary(
    @Param('employeeId') employeeId: string,
    @Param('courseId') courseId: string,
    @Body() body: { context?: string },
  ) {
    const prompt = `
        You are an AI learning analyst for Corporate Training.
        
        Employee ID: ${employeeId}
        Course ID: ${courseId}
        Context: ${body.context || 'corporate_training'}

        Analyze and provide a comprehensive progress summary including:
        - Current progress status
        - Strengths and areas for improvement
        - Recommended next steps
        - Estimated completion time
        `;
    return this.aiService.askGemini(prompt);
  }

  @Get('recommendations/:employeeId/:courseId')
  @UseGuards(JwtGuard)
  async getRecommendations(
    @Param('employeeId') employeeId: string,
    @Param('courseId') courseId: string,
    @Req() req,
  ) {
    const prompt = `
        You are an AI learning recommender for Corporate Training.
        
        Employee ID: ${employeeId}
        Course ID: ${courseId}
        Requester Role: ${req.user.role}

        Provide personalized recommendations including:
        - Additional learning resources
        - Skill development paths
        - Related courses
        - Study tips for corporate environment
        `;
    return this.aiService.askGemini(prompt);
  }

  @Post('generate-path')
  @UseGuards(JwtGuard)
  async generateTrainingPath(
    @Body() body: { employeeProfile: any; context?: string },
  ) {
    const prompt = `
        You are an AI training path designer for Corporate Training.
        
        Employee Profile: ${JSON.stringify(body.employeeProfile)}
        Context: ${body.context || 'corporate_training'}

        Generate a personalized training path including:
        - Recommended courses in order
        - Skill milestones
        - Estimated timeline
        - Prerequisites and next steps
        `;
    return this.aiService.askGemini(prompt);
  }

  @Post('analyze-performance')
  @UseGuards(JwtGuard)
  async analyzePerformance(
    @Body() body: { employeeId: string; timeRange: string; context?: string },
  ) {
    const prompt = `
        You are an AI performance analyst for Corporate Training.
        
        Employee ID: ${body.employeeId}
        Time Range: ${body.timeRange}
        Context: ${body.context || 'corporate_training'}

        Analyze performance and provide:
        - Learning trends
        - Performance metrics
        - Improvement suggestions
        - Recognition opportunities
        `;
    return this.aiService.askGemini(prompt);
  }
}

import { Controller,Get, Post, Body, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService){}

    @Post('ask')
    // async askQuestion(@Body('question') question: string){
    //     const answer = await this.aiService.askGemini(question);
    //     return { answer }
    // }
        async askAI(
        @Body() body: { courseName: string; question: string },
    ) {
        const prompt = 
        `
        You are an AI Tutor.
        Course: ${body.courseName}

        Student Question: ${body.question}

        Provide a clear, helpful explanation.

        `;
      return this.aiService.askGemini(prompt);
      }


    @Post('generate-quiz')
        async generateQuiz(
  @Body() body: { courseName: string; topic: string },
   ) {
  const prompt = `
  You are an LMS quiz generator.

  Course: ${body.courseName}
  Topic: ${body.topic}

  Generate 3 multiple choice questions.

  Format:
  Question:
  A)
  B)
  C)
  D)
  Correct Answer:
  `;

  return this.aiService.askGemini(prompt);
      }


    //ai generated progress-summary 
    @Post('progress-summary/:studentId/:courseId')
      async generateStudentSummary(
     @Param('studentId') studentId: string,
     @Param('courseId') courseId: string,
    ) {
    return this.aiService.generateStudentSummary(studentId, courseId);
}



@Get('recommendations/:studentId/:courseId')
async getRecommendations(
  @Param('studentId') studentId: string,
  @Param('courseId') courseId: string,
) {
  return this.aiService.generateLearningRecommendations(
    studentId,
    courseId,
  );
}
    
}


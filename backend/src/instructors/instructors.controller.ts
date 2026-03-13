import { Controller, Get } from '@nestjs/common';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get('public')
  async getPublicInstructors() {
    try {
      const instructors = await this.instructorsService.getPublicInstructors();
      return {
        success: true,
        instructors: instructors
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch instructors',
        error: error.message
      };
    }
  }
}

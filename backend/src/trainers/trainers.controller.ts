import { Controller, Get } from '@nestjs/common';
import { TrainersService } from './trainers.service';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get('public')
  async getPublicTrainers() {
    try {
      const trainers = await this.trainersService.getPublicTrainers();
      return {
        success: true,
        trainers: trainers
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch trainers',
        error: error.message
      };
    }
  }
}

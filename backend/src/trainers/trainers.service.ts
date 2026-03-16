import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TrainersService {
  private readonly logger = new Logger(TrainersService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    this.logger.log('TrainersService initialized');
  }

  async getPublicTrainers() {
    try {
      this.logger.log('Fetching public trainers from database');
      
      // Fetch users with role 'trainer' and isVerifiedTrainer = true
      const trainers = await this.userModel
        .find({ 
          role: 'trainer',
          isVerifiedTrainer: true 
        })
        .select('-password') // Exclude password from results
        .lean() // Use lean for better performance
        .exec();
      
      this.logger.log(`Found ${trainers.length} verified trainers`);
      
      // Transform User data to Trainer format expected by frontend
      return trainers.map(trainer => ({
        _id: trainer._id,
        name: trainer.name,
        title: 'Expert Trainer', // Default title, can be enhanced later
        bio: `Passionate trainer with expertise in their field. Verified and ready to teach.`,
        avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5UcmFpbjwvdGV4dD48L3N2Zz4=',
        rating: 4.5, // Default rating, can be enhanced later
        totalStudents: Math.floor(Math.random() * 1000) + 100, // Mock data for now
        totalCourses: Math.floor(Math.random() * 10) + 1, // Mock data for now
        experience: Math.floor(Math.random() * 10) + 1, // Mock data for now
        location: 'Remote', // Default location
        specialties: ['teaching', 'expertise'], // Default specialties
        isVerified: trainer.isVerifiedTrainer || false,
        email: trainer.email // Include email for debugging
      }));
    } catch (error) {
      this.logger.error('Error fetching trainers from database:', error.message);
      
      // Fallback to empty array if database fails
      return [];
    }
  }

  async getTrainerById(id: string) {
    try {
      this.logger.log(`Fetching trainer with id: ${id}`);
      
      const trainer = await this.userModel
        .findOne({ 
          _id: id,
          role: 'trainer',
          isVerifiedTrainer: true 
        })
        .select('-password')
        .lean()
        .exec();
      
      if (!trainer) {
        this.logger.warn(`Trainer with id ${id} not found`);
        return null;
      }
      
      this.logger.log(`Found trainer: ${trainer.name}`);
      
      // Transform User data to Trainer format expected by frontend
      return {
        _id: trainer._id,
        name: trainer.name,
        title: 'Expert Trainer',
        bio: `Passionate trainer with expertise in their field. Verified and ready to teach.`,
        avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5UcmFpbjwvdGV4dD48L3N2Zz4=',
        rating: 4.5,
        totalStudents: Math.floor(Math.random() * 1000) + 100,
        totalCourses: Math.floor(Math.random() * 10) + 1,
        experience: Math.floor(Math.random() * 10) + 1,
        location: 'Remote',
        specialties: ['teaching', 'expertise'],
        isVerified: trainer.isVerifiedTrainer || false,
        email: trainer.email
      };
    } catch (error) {
      this.logger.error(`Error fetching trainer ${id}:`, error.message);
      return null;
    }
  }

  async createTrainer(createTrainerDto: any) {
    // TODO: Implement actual database creation
    this.logger.log('Creating trainer:', createTrainerDto);
    return createTrainerDto;
  }
}

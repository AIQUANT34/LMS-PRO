import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TrainersService]
})
export class TrainersModule {}

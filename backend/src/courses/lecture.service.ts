import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecture, LectureDocument } from './schemas/lecture.schema';
import { CreateLectureDto, UpdateLectureDto } from './dto/lecture.dto';
import { AwsS3Service } from '../upload/aws-s3.service';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private lectureModel: Model<LectureDocument>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async create(createLectureDto: CreateLectureDto, trainerId: string): Promise<Lecture> {
    // Get the highest order number for this course
    const lastLecture = await this.lectureModel
      .findOne({ courseId: createLectureDto.courseId })
      .sort({ order: -1 })
      .exec();

    const lecture = new this.lectureModel({
      ...createLectureDto,
      trainerId,
      order: lastLecture ? lastLecture.order + 1 : 1,
    });

    return lecture.save();
  }

  async findByCourse(courseId: string, trainerId?: string): Promise<Lecture[]> {
    const query: any = { courseId, isDeleted: false };
    
    if (trainerId) {
      query.trainerId = trainerId;
    }

    return this.lectureModel
      .find(query)
      .sort({ order: 1 })
      .populate('trainerId', 'name email')
      .exec();
  }

  async findOne(id: string, trainerId?: string): Promise<Lecture> {
    const query: any = { _id: id, isDeleted: false };
    
    if (trainerId) {
      query.trainerId = trainerId;
    }

    const lecture = await this.lectureModel
      .findOne(query)
      .populate('trainerId', 'name email')
      .populate('courseId', 'title')
      .exec();

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return lecture;
  }

  async update(id: string, updateLectureDto: UpdateLectureDto, trainerId: string): Promise<Lecture> {
    const lecture = await this.findOne(id, trainerId);

    // Update metrics if video is changed
    if (updateLectureDto.videoUrl && updateLectureDto.videoUrl !== lecture.videoUrl) {
      updateLectureDto.metrics = {
        views: 0,
        completionRate: 0,
        averageWatchTime: 0,
      };
    }

    const updatedLecture = await this.lectureModel
      .findByIdAndUpdate(id, updateLectureDto, { returnDocument: 'after' })
      .exec();
      
    if (!updatedLecture) {
      throw new Error('Failed to update lecture');
    }
    
    return updatedLecture;
  }

  async remove(id: string, trainerId: string): Promise<void> {
    const lecture = await this.findOne(id, trainerId);

    // Soft delete
    await this.lectureModel
      .findByIdAndUpdate(id, { isDeleted: true })
      .exec()
      .then(() => {}); // Return void

    // Delete associated files from S3
    if (lecture.videoUrl) {
      const key = this.extractS3KeyFromUrl(lecture.videoUrl);
      if (key) {
        await this.awsS3Service.deleteFile(key).catch(() => {}); // Ignore errors
      }
    }

    if (lecture.thumbnailUrl) {
      const key = this.extractS3KeyFromUrl(lecture.thumbnailUrl);
      if (key) {
        await this.awsS3Service.deleteFile(key).catch(() => {}); // Ignore errors
      }
    }

    // Delete resource files
    for (const resource of lecture.resourceFiles) {
      const key = this.extractS3KeyFromUrl(resource.url);
      if (key) {
        await this.awsS3Service.deleteFile(key).catch(() => {}); // Ignore errors
      }
    }
  }

  async reorderLectures(courseId: string, lectureOrders: Array<{ id: string; order: number }>, trainerId: string): Promise<void> {
    // Verify instructor owns the course
    const lectures = await this.lectureModel.find({
      courseId,
      trainerId,
      isDeleted: false,
    }).exec();

    if (lectures.length === 0) {
      throw new NotFoundException('No lectures found for this course');
    }

    // Update orders
    const updatePromises = lectureOrders.map(({ id, order }) =>
      this.lectureModel.findByIdAndUpdate(id, { order }).exec()
    );

    await Promise.all(updatePromises);
  }

  async addResourceFile(lectureId: string, resourceFile: {
    name: string;
    url: string;
    type: string;
    size: number;
  }, trainerId: string): Promise<Lecture> {
    const lecture = await this.findOne(lectureId, trainerId);

    return this.lectureModel.findByIdAndUpdate(
      lectureId,
      {
        $push: {
          resourceFiles: resourceFile,
        },
      },
      { returnDocument: 'after' },
    ).exec() as Promise<Lecture>;
  }

  async removeResourceFile(lectureId: string, fileUrl: string, trainerId: string): Promise<Lecture> {
    const lecture = await this.findOne(lectureId, trainerId);

    // Delete file from S3
    const key = this.extractS3KeyFromUrl(fileUrl);
    if (key) {
      await this.awsS3Service.deleteFile(key).catch(() => {}); // Ignore errors
    }

    return this.lectureModel
      .findByIdAndUpdate(
        lectureId,
        {
          $pull: {
            resourceFiles: { url: fileUrl },
          },
        },
        { returnDocument: 'after' },
      ).exec() as Promise<Lecture>;
  }

  async updateMetrics(lectureId: string, metrics: {
    views?: number;
    completionRate?: number;
    averageWatchTime?: number;
  }): Promise<Lecture> {
    return this.lectureModel
      .findByIdAndUpdate(
        lectureId,
        {
          $set: {
            'metrics.views': metrics.views,
            'metrics.completionRate': metrics.completionRate,
            'metrics.averageWatchTime': metrics.averageWatchTime,
          },
        },
        { returnDocument: 'after' },
      ).exec() as Promise<Lecture>;
  }

  private extractS3KeyFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Extract key from S3 URL
    // Example: https://bucket-name.s3.region.amazonaws.com/folder/file.ext
    const urlParts = url.split('/');
    if (urlParts.length >= 4) {
      return urlParts.slice(3).join('/');
    }
    
    return null;
  }

  async getLectureStats(courseId: string, trainerId: string): Promise<{
    totalLectures: number;
    totalDuration: number;
    publishedLectures: number;
    totalViews: number;
  }> {
    const lectures = await this.lectureModel.find({
      courseId,
      trainerId,
      isDeleted: false,
    }).exec();

    const totalLectures = lectures.length;
    const totalDuration = lectures.reduce((sum, lecture) => sum + (lecture.videoDuration || 0), 0);
    const publishedLectures = lectures.filter(lecture => lecture.isPublished).length;
    const totalViews = lectures.reduce((sum, lecture) => sum + lecture.metrics.views, 0);

    return {
      totalLectures,
      totalDuration,
      publishedLectures,
      totalViews,
    };
  }
}

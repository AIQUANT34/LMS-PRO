import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async searchCourses(query: string, filters: any = {}) {
    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
      status: 'published',
    };

    // Apply filters
    if (filters.level) {
      searchQuery.level = filters.level;
    }
    if (filters.priceMin !== undefined) {
      searchQuery.price = { $gte: filters.priceMin };
    }
    if (filters.priceMax !== undefined) {
      if (searchQuery.price) {
        searchQuery.price.$lte = filters.priceMax;
      } else {
        searchQuery.price = { $lte: filters.priceMax };
      }
    }
    if (filters.duration) {
      searchQuery.duration = { $lte: filters.duration };
    }
    if (filters.rating) {
      searchQuery['ratings.average'] = { $gte: filters.rating };
    }

    const courses = await this.courseModel
      .find(searchQuery)
      .populate('trainerId', 'name email')
      .sort({
        ...(filters.sortBy
          ? { [filters.sortBy]: filters.sortOrder || -1 }
          : { createdAt: -1 }),
      })
      .skip((filters.page - 1) * (filters.limit || 10))
      .limit(filters.limit || 10)
      .exec();

    const total = await this.courseModel.countDocuments(searchQuery);

    return {
      courses,
      total,
      page: filters.page || 1,
      totalPages: Math.ceil(total / (filters.limit || 10)),
      filters: {
        query,
        ...filters,
      },
    };
  }

  async getPopularSearches(_limit: number = 10) {
    // This would return popular search terms from analytics
    // For now, return mock data
    return [
      { query: 'React development', count: 156 },
      { query: 'JavaScript basics', count: 142 },
      { query: 'Node.js backend', count: 98 },
      { query: 'Python programming', count: 87 },
      { query: 'Web development', count: 76 },
      { query: 'Data structures', count: 65 },
      { query: 'Machine learning', count: 54 },
      { query: 'Database design', count: 43 },
      { query: 'API development', count: 32 },
      { query: 'Cloud computing', count: 21 },
    ].slice(0, _limit);
  }

  async getSearchSuggestions(query: string, limit: number = 5) {
    const courses = await this.courseModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
        status: 'published',
      })
      .select('title')
      .limit(limit)
      .exec();

    // Process suggestions
    const suggestions = courses.map((course) => ({
      type: 'course',
      text: course.title,
      highlight: course.title.replace(
        new RegExp(query, 'gi'),
        (match) => `<mark>${match}</mark>`,
      ),
    }));

    return suggestions;
  }

  async saveSearchHistory(userId: string, query: string, filters: any = {}) {
    // This would save search history for analytics
    // For now, just log it
    console.log(`Search history saved for user ${userId}:`, { query, filters });
    return { message: 'Search history saved' };
  }

  async getSearchHistory(userId: string, limit: number = 20) {
    // This would return user's search history
    // For now, return empty array
    return [];
  }

  async clearSearchHistory(userId: string) {
    // This would clear user's search history
    return { message: 'Search history cleared' };
  }
}

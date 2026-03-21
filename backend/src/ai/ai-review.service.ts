import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIReviewLog, AIReviewLogDocument } from './schemas/ai-review-log.schema';

@Injectable()
export class AIReviewService {
  private readonly logger = new Logger(AIReviewService.name);

  constructor(
    @InjectModel(AIReviewLog.name)
    private readonly aiReviewLogModel: Model<AIReviewLogDocument>,
  ) {}

  async logAIInteraction(
    userId: string,
    userType: 'student' | 'trainer' | 'admin',
    aiFeature: 'tutor' | 'quiz' | 'summary' | 'other',
    input: string,
    aiResponse: string,
    courseId?: string,
    sessionId?: string,
    responseTime?: number,
  ): Promise<AIReviewLogDocument> {
    try {
      const logEntry = new this.aiReviewLogModel({
        userId,
        userType,
        aiFeature,
        input,
        aiResponse,
        courseId,
        sessionId,
        responseTime: responseTime || 1,
        aiModel: 'gemini',
      });

      await logEntry.save();
      
      this.logger.log(`🤖 AI interaction logged: ${aiFeature} by ${userType} ${userId}`);
      
      // Auto-flag potentially problematic responses
      await this.autoFlagResponse(logEntry);
      
      return logEntry;
    } catch (error) {
      this.logger.error('❌ Failed to log AI interaction:', error);
      throw error;
    }
  }

  async autoFlagResponse(logEntry: AIReviewLogDocument): Promise<void> {
    const response = logEntry.aiResponse.toLowerCase();
    
    // Auto-flag criteria
    const flagCriteria = [
      'i don\'t understand',
      'i cannot',
      'i\'m not sure',
      'inappropriate',
      'offensive',
      'harmful',
      'dangerous',
      'illegal',
    ];

    const shouldFlag = flagCriteria.some(criteria => 
      response.includes(criteria)
    );

    if (shouldFlag) {
      logEntry.flagged = true;
      logEntry.flagReason = 'Auto-flagged: Contains uncertain or potentially problematic content';
      await logEntry.save();
      
      this.logger.warn(`🚩 AI response auto-flagged for review: ${logEntry._id}`);
    }
  }

  async getUnreviewedLogs(limit: number = 50): Promise<AIReviewLogDocument[]> {
    return this.aiReviewLogModel
      .find({ reviewed: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .exec();
  }

  async getFlaggedLogs(limit: number = 50): Promise<AIReviewLogDocument[]> {
    return this.aiReviewLogModel
      .find({ flagged: true, reviewed: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .exec();
  }

  async reviewLog(
    logId: string,
    reviewedBy: string,
    reviewed: boolean,
    flagged: boolean,
    reviewNotes?: string,
  ): Promise<AIReviewLogDocument> {
    const logEntry = await this.aiReviewLogModel.findById(logId);
    
    if (!logEntry) {
      throw new Error('AI review log not found');
    }

    logEntry.reviewed = true;
    logEntry.flagged = flagged;
    logEntry.reviewedBy = reviewedBy;
    logEntry.reviewNotes = reviewNotes;
    logEntry.reviewedAt = new Date();

    await logEntry.save();
    
    this.logger.log(`✅ AI log reviewed: ${logId} by ${reviewedBy}`);
    
    return logEntry;
  }

  async getAIAnalytics(): Promise<any> {
    const totalInteractions = await this.aiReviewLogModel.countDocuments();
    const unreviewedCount = await this.aiReviewLogModel.countDocuments({ reviewed: false });
    const flaggedCount = await this.aiReviewLogModel.countDocuments({ flagged: true });
    
    const featureStats = await this.aiReviewLogModel.aggregate([
      {
        $group: {
          _id: '$aiFeature',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const dailyStats = await this.aiReviewLogModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    return {
      totalInteractions,
      unreviewedCount,
      flaggedCount,
      reviewRate: ((totalInteractions - unreviewedCount) / totalInteractions * 100).toFixed(1),
      flagRate: ((flaggedCount / totalInteractions) * 100).toFixed(1),
      featureStats,
      dailyStats
    };
  }

  async getLogsByUser(userId: string, limit: number = 20): Promise<AIReviewLogDocument[]> {
    return this.aiReviewLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

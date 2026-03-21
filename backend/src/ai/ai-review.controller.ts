import { Controller, Get, Post, Put, Query, Body, UseGuards, Param, Req } from '@nestjs/common';
import { AIReviewService } from './ai-review.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('ai-review')
@UseGuards(JwtGuard)
export class AIReviewController {
  constructor(private readonly aiReviewService: AIReviewService) {}

  @Get('unreviewed')
  async getUnreviewedLogs(@Query('limit') limit?: string, @Req() req?: any) {
    // Only admin can access
    if (req?.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return await this.aiReviewService.getUnreviewedLogs(limit ? parseInt(limit) : 50);
  }

  @Get('flagged')
  async getFlaggedLogs(@Query('limit') limit?: string, @Req() req?: any) {
    // Only admin can access
    if (req?.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return await this.aiReviewService.getFlaggedLogs(limit ? parseInt(limit) : 50);
  }

  @Get('analytics')
  async getAIAnalytics(@Req() req?: any) {
    // Only admin can access
    if (req?.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return await this.aiReviewService.getAIAnalytics();
  }

  @Get('user/:userId')
  async getUserLogs(@Param('userId') userId: string, @Query('limit') limit?: string, @Req() req?: any) {
    // Admin or trainer can access
    if (req?.user?.role !== 'admin' && req?.user?.role !== 'trainer') {
      throw new Error('Admin or trainer access required');
    }
    return await this.aiReviewService.getLogsByUser(userId, limit ? parseInt(limit) : 20);
  }

  @Put('review/:logId')
  async reviewLog(
    @Param('logId') logId: string,
    @Req() req: any,
    @Body() reviewData: {
      reviewed: boolean;
      flagged: boolean;
      reviewNotes?: string;
    }
  ) {
    // Only admin can access
    if (req?.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return await this.aiReviewService.reviewLog(
      logId,
      req.user.userId,
      reviewData.reviewed,
      reviewData.flagged,
      reviewData.reviewNotes
    );
  }

  @Post('bulk-review')
  async bulkReviewLogs(
    @Req() req: any,
    @Body() bulkReviewData: {
      logIds: string[];
      reviewed: boolean;
      flagged: boolean;
      reviewNotes?: string;
    }
  ) {
    // Only admin can access
    if (req?.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    const results: any[] = [];
    
    for (const logId of bulkReviewData.logIds) {
      try {
        const result = await this.aiReviewService.reviewLog(
          logId,
          req.user.userId,
          bulkReviewData.reviewed,
          bulkReviewData.flagged,
          bulkReviewData.reviewNotes
        );
        results.push({ logId, success: true, result });
      } catch (error) {
        results.push({ logId, success: false, error: error.message });
      }
    }
    
    return { results, processed: results.length };
  }
}

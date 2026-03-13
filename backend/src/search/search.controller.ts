import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('courses')
  async searchCourses(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('duration') duration?: string,
    @Query('rating') rating?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const filters = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      category,
      level,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1,
    };

    return this.searchService.searchCourses(query, filters);
  }

  @Get('suggestions')
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getSearchSuggestions(
      query,
      limit ? parseInt(limit) : 5,
    );
  }

  @Get('popular')
  async getPopularSearches(@Query('limit') limit?: string) {
    return this.searchService.getPopularSearches(limit ? parseInt(limit) : 10);
  }

  @Get('history')
  @UseGuards(JwtGuard)
  async getSearchHistory(@Req() req: any, @Query('limit') limit?: string) {
    return this.searchService.getSearchHistory(
      req.user.userId,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('history/save')
  @UseGuards(JwtGuard)
  async saveSearchHistory(
    @Req() req: any,
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.searchService.saveSearchHistory(req.user.userId, query, {
      category,
      level,
    });
  }

  @Get('history/clear')
  @UseGuards(JwtGuard)
  async clearSearchHistory(@Req() req: any) {
    return this.searchService.clearSearchHistory(req.user.userId);
  }
}

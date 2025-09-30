import { ApiService } from './api.service';
import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  Param,
  Req,
  Query,
  Delete,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import type { FastifyRequest } from 'fastify';

@Controller('/')
@UseInterceptors(CacheInterceptor)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('ideas')
  @CacheTTL(60)
  public async getIdeas(
    @Query('limit') limit?: string | number,
    @Query('offset') offset?: string | number,
  ) {
    return this.apiService.getIdeas(Number(limit), Number(offset));
  }

  @Get('ideas/:ideaId')
  @CacheTTL(60)
  public async getIdeaById(@Param('ideaId') ideaId: string) {
    return this.apiService.getIdeaById(ideaId);
  }

  @Get('votes/status')
  @CacheTTL(30)
  public async getVoteStatus(@Req() req: FastifyRequest) {
    const ip = this.apiService.getIp(req);

    return this.apiService.getVoteStatus(ip);
  }

  @Post('ideas/:ideaId/vote')
  public async voteIdea(
    @Param('ideaId') ideaId: string,
    @Req() req: FastifyRequest,
  ) {
    const ip = this.apiService.getIp(req);

    return this.apiService.voteIdea(ideaId, ip);
  }

  @Delete('votes/reset')
  public async resetVotes(@Req() req: FastifyRequest) {
    const ip = this.apiService.getIp(req);

    return this.apiService.resetVotes(ip);
  }
}

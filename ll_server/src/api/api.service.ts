import { DatabaseService } from '../database/database.service';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ApiService {
  private readonly logger: Logger = new Logger(ApiService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  public async getIdeas(limit: number = 100, offset: number = 0) {
    const validLimit = Number.isNaN(limit) || limit <= 0 ? 100 : limit;
    const validOffset = Number.isNaN(offset) || offset < 0 ? 0 : offset;

    const ideas = await this.databaseService.idea.findMany({
      include: { votes: { omit: { ideaId: true, ipAddress: true } } },
      take: validLimit,
      skip: validOffset,
    });

    this.logger.debug(`Fetched ${ideas.length} ideas from database`);

    const ideasWithVoteCount = ideas.map((idea) => ({
      ...idea,
      votes: idea.votes.length,
    }));

    ideasWithVoteCount.sort((a, b) => b.votes - a.votes);

    return {
      ideas: ideasWithVoteCount,
      total: await this.databaseService.idea.count(),
    };
  }

  public async getIdeaById(ideaId: string) {
    const idea = await this.databaseService.idea.findUnique({
      where: { id: ideaId },
      include: { votes: { omit: { ideaId: true, ipAddress: true } } },
    });

    if (!idea) {
      this.logger.warn(`Idea with ID ${ideaId} not found`);
      throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`Fetched idea ${ideaId} from database`);

    return {
      ...idea,
      votes: idea.votes.length,
    };
  }

  public async getVoteStatus(ipAddress: string) {
    const voteCount = await this.databaseService.vote.count({
      where: { ipAddress },
    });

    const votedIdeas = await this.databaseService.vote.findMany({
      where: { ipAddress },
      select: { ideaId: true },
    });

    const votedIdeaIds = votedIdeas.map((vote) => vote.ideaId);

    this.logger.debug(
      `IP ${ipAddress} has ${voteCount} votes for ideas: ${votedIdeaIds.join(', ')}`,
    );

    return {
      totalVotes: voteCount,
      votedIdeaIds,
      canVote: voteCount < 10,
      remainingVotes: Math.max(0, 10 - voteCount),
    };
  }

  public async voteIdea(ideaId: string, ipAddress: string) {
    const idea = await this.databaseService.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      this.logger.warn(`Idea with ID ${ideaId} not found`);
      throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
    }

    const voteCount = await this.databaseService.vote.count({
      where: { ipAddress },
    });

    if (voteCount >= 10) {
      this.logger.warn(`Vote limit exceeded for IP address ${ipAddress}`);
      throw new HttpException('Vote limit exceeded', HttpStatus.CONFLICT);
    }

    try {
      await this.databaseService.vote.create({
        data: { ideaId, ipAddress },
      });

      this.logger.log(
        `Vote recorded for idea ID ${ideaId} from IP ${ipAddress}`,
      );

      return { message: 'Vote recorded', idea: idea };
    } catch (error) {
      this.logger.error(`Failed to record vote for idea ID ${ideaId}`, error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          'Already voted for this idea',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  }

  public async resetVotes(ipAddress: string) {
    try {
      const deleteResult = await this.databaseService.vote.deleteMany({
        where: { ipAddress },
      });

      this.logger.log(
        `Deleted ${deleteResult.count} votes for IP ${ipAddress}`,
      );

      return { message: `Deleted ${deleteResult.count} votes` };
    } catch (error) {
      this.logger.error(`Failed to reset votes for IP ${ipAddress}`, error);
      throw new HttpException(
        'Failed to reset votes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getIp(req: FastifyRequest): string {
    const forwarded = String(req.headers['x-forwarded-for'] || '');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || req.ip;

    if (!ip) {
      throw new Error('Unable to determine client IP');
    }

    return ip;
  }
}

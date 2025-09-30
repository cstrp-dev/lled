import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}

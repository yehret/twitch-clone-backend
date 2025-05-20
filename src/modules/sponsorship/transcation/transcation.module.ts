import { Module } from '@nestjs/common';
import { TranscationService } from './transcation.service';
import { TranscationResolver } from './transcation.resolver';

@Module({
  providers: [TranscationResolver, TranscationService],
})
export class TranscationModule {}

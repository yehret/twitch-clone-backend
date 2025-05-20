import { Resolver } from '@nestjs/graphql';
import { TranscationService } from './transcation.service';

@Resolver('Transcation')
export class TranscationResolver {
  constructor(private readonly transcationService: TranscationService) {}
}

import { Resolver } from '@nestjs/graphql';
import { CronService } from './cron.service';

@Resolver('Cron')
export class CronResolver {
  constructor(private readonly cronService: CronService) {}
}

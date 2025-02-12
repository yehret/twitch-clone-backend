import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CronResolver } from './cron.resolver'
import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronResolver, CronService]
})
export class CronModule {}

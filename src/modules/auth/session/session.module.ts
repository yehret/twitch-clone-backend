import { Module } from '@nestjs/common'

import { RedisService } from '@/src/core/redis/redis.service'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [SessionResolver, SessionService, RedisService]
})
export class SessionModule {}

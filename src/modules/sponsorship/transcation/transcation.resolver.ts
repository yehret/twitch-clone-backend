import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { MakePaymentModel } from './models/make-payment.model'
import { TransactionModel } from './models/transcation.model'
import { TranscationService } from './transcation.service'

@Resolver('Transcation')
export class TranscationResolver {
	public constructor(
		private readonly transcationService: TranscationService
	) {}

	@Authorization()
	@Query(() => [TransactionModel], { name: 'findMyTransactions' })
	public async findMyTransactions(@Authorized() user: User) {
		return this.transcationService.findMyTransactions(user)
	}

	@Authorization()
	@Mutation(() => [MakePaymentModel], { name: 'makePayment' })
	public async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string
	) {
		return this.transcationService.makePayment(user, planId)
	}
}

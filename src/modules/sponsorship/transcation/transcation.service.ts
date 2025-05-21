import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StripeService } from '../../libs/stripe/stripe.service'

@Injectable()
export class TranscationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly stripeService: StripeService
	) {}

	public async findMyTransactions(user: User) {
		const transactions = await this.prismaService.transaction.findMany({
			where: {
				id: user.id
			}
		})

		if (!transactions) {
			throw new NotFoundException('Transactions not found')
		}

		return transactions
	}

	public async makePayment(user: User, planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			},
			include: {
				channel: true
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (user.id === plan.channelId) {
			throw new ConflictException('You can not buy your own plan')
		}

		const existingSubscription =
			await this.prismaService.sponsorshipSubscription.findFirst({
				where: {
					userId: user.id,
					channelId: plan.channelId
				}
			})

		if (existingSubscription) {
			throw new ConflictException(
				'You are already a sponsor of this channel'
			)
		}

		const customer = await this.stripeService.customers.create({
			name: user.username,
			email: user.email
		})

		if (!plan.channel) {
			throw new Error('Plan must be associated with a channel')
		}

		// TODO: add more payment methods, add to cron auto-payment notification
		const session = await this.stripeService.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: plan.title,
							description: plan.description ?? ''
						},
						unit_amount: Math.round(plan.price * 100),
						recurring: {
							interval: 'month'
						}
					}
				}
			],
			mode: 'subscription',
			success_url: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${plan.price}&username=${plan.channel.username}`,
			cancel_url: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}`,
			customer: customer.id,
			metadata: {
				planId: plan.id,
				userId: user.id,
				channelId: plan.channel.id
			}
		})

		if (!session.currency) {
			throw new Error('Currency is required but was null')
		}

		await this.prismaService.transaction.create({
			data: {
				amount: plan.price,
				currency: session.currency,
				stripeSubscriptionId: session.id,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return { url: session.url }
	}
}

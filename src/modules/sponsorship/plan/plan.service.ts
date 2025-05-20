import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StripeService } from '../../libs/stripe/stripe.service'

import { CreatePlanInput } from './inputs/create-plan.input'

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id
			}
		})

		return plans
	}

	public async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id
			}
		})

		if (!channel) {
			throw new Error('Channel not found')
		}

		if (!channel.isVerified) {
			throw new ForbiddenException(
				'Only verified users channels can create subscriptions'
			)
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'usd',
			interval: 'month',
			product: {
				name: title
			}
		})

		if (!stripePlan.product) {
			throw new Error('stripePlan.product is null')
		}

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan.product.toString(),
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	public async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		await this.stripeService.plans.del(plan.stripePlanId)
		await this.stripeService.plans.del(plan.stripeProductId)

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id
			}
		})

		return true
	}
}

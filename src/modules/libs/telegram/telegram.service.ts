import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { BUTTONS } from './telegram.buttons'
import { MESSAGES } from './telegram.messages'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	@Start()
	public async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()
		const token = ctx.message.text.split(' ')[1]

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH
				}
			})

			if (!authToken) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)

				return
			}

			const hasExpired = new Date(authToken.expiresIn) < new Date()

			if (hasExpired) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)

				return
			}

			await this.connectTelegram(authToken.userId!, chatId)

			await this.prismaService.token.delete({
				where: {
					id: authToken.id
				}
			})

			await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
		} else {
			const user = await this.findUserByChatId(chatId)

			if (user) {
				return await this.onMe(ctx)
			} else {
				await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
			}
		}
	}

	@Command('me')
	@Action('me')
	public async onMe(@Ctx() ctx: Context) {
		if (!ctx.chat) {
			return await ctx.replyWithHTML(MESSAGES.errorMessage)
		}

		const chatId = ctx.chat.id.toString()
		const user = await this.findUserByChatId(chatId)

		if (!user) {
			return await ctx.replyWithHTML(MESSAGES.errorMessage)
		}

		const followersCount = await this.prismaService.follow.count({
			where: {
				followingId: user.id
			}
		})

		await ctx.replyWithHTML(
			MESSAGES.profile(user, followersCount),
			BUTTONS.profile
		)
	}

	@Command('follows')
	@Action('follows')
	public async onFollows(@Ctx() ctx: Context) {
		if (!ctx.chat) {
			return await ctx.replyWithHTML(MESSAGES.errorMessage)
		}

		const chatId = ctx.chat.id.toString()

		const user = await this.findUserByChatId(chatId)

		if (!user) {
			return await ctx.replyWithHTML(MESSAGES.errorMessage)
		}

		const follows = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id
			},
			include: {
				following: true
			}
		})

		if (user && follows.length) {
			const followsList = follows
				.map(follow => MESSAGES.follows(follow.following))
				.join('\n')

			const message = `<b>🌟 Followed channels:</b>\n\n${followsList}`

			await ctx.replyWithHTML(message)
		} else {
			await ctx.replyWithHTML("<b>❌ You don't follow any channels</b>")
		}
	}

	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				telegramId: chatId
			}
		})
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				telegramId: chatId
			},
			include: {
				followers: true,
				followings: true
			}
		})

		return user
	}
}

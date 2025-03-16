import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LivekitService } from '../libs/livekit/livekit.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}

	public async receiveWebhookLivekit(body: string, authorization: string) {
		try {
			const event = await this.livekitService.receiver.receive(
				body,
				authorization,
				true
			)

			if (event.event === 'ingress_started') {
				console.log('stream started: ', event.ingressInfo?.url)

				await this.prismaService.stream.update({
					where: {
						ingressId: event.ingressInfo?.ingressId
					},
					data: {
						isLive: true
					}
				})
			}

			if (event.event === 'ingress_ended') {
				await this.prismaService.stream.update({
					where: {
						ingressId: event.ingressInfo?.ingressId
					},
					data: {
						isLive: false
					}
				})
			}
		} catch (error) {
			console.error('Error processing webhook:', error.message)
		}
	}
}

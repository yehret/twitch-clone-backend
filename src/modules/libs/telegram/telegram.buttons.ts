import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📜 My follows', 'follows'),
			Markup.button.callback('👤 View profile', 'me')
		],
		[Markup.button.url('🌐 To website', 'https://google.com')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url('⚙️ Account settings', 'https://google.com')
	])
}

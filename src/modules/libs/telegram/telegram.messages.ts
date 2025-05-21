import type { SponsorshipPlan, User } from '@/prisma/generated'
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome:
		`<b>👋 Welcome to TwitchClone Bot!</b>\n\n` +
		`To receive notifications and enhance your experience on the platform, let's link your Telegram account with TwitchClone.\n\n` +
		`Click the button below and go to the <b>Notifications</b> section to complete the setup.`,
	authSuccess: `🎉 You have successfully logged in, and your Telegram account is linked with TwitchClone!\n\n`,
	invalidToken: '❌ Invalid or expired token.',
	profile: (user: User, followersCount: number) =>
		`<b>👤 User Profile:</b>\n\n` +
		`👤 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Followers count: <b>${followersCount}</b>\n` +
		`📝 About me: <b>${user.bio || 'Not specified'}</b>\n\n` +
		`🔧 Click the button below to go to your profile settings.`,
	follows: (user: User) =>
		`📺 <a href="https://twitchclone.com/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Password Reset</b>\n\n` +
		`You requested a password reset for your account on <b>TwitchClone</b>.\n\n` +
		`To create a new password, please follow this link:\n\n` +
		`<b><a href="https://twitchclone.com/account/recovery/${token}">Reset Password</a></b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Information:</b>\n\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Operating System:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`If you did not make this request, simply ignore this message.\n\n` +
		`Thank you for using <b>TwitchClone</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Account Deactivation Request</b>\n\n` +
		`You initiated the deactivation process for your account on <b>TwitchClone</b>.\n\n` +
		`To complete the operation, please confirm your request by entering the following confirmation code:\n\n` +
		`<b>Confirmation Code: ${token}</b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Information:</b>\n\n` +
		`• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`• 📱 <b>Operating System:</b> ${metadata.device.os}\n` +
		`• 🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`• 💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`<b>What will happen after deactivation?</b>\n\n` +
		`1. You will automatically log out and lose access to your account.\n` +
		`2. If you do not cancel the deactivation within 7 days, your account will be <b>irreversibly deleted</b> with all your information, data, and subscriptions.\n\n` +
		`<b>⏳ Please note:</b> If you change your mind within 7 days, you can contact our support to restore access to your account before it is completely deleted.\n\n` +
		`After deletion, your account cannot be restored, and all data will be lost without any possibility of recovery.\n\n` +
		`If you changed your mind, simply ignore this message. Your account will remain active.\n\n` +
		`Thank you for using <b>TwitchClone</b>! We are always happy to have you on our platform and hope you will stay with us. 🚀\n\n` +
		`Sincerely,\n` +
		`The TwitchClone Team`,
	accountDeleted:
		`<b>⚠️ Your account has been completely deleted.</b>\n\n` +
		`Your account has been completely erased from the TwitchClone database. All your data and information have been permanently deleted. ❌\n\n` +
		`🔒 You will no longer receive notifications on Telegram or by email.\n\n` +
		`If you want to return to the platform, you can register at the following link:\n` +
		`<b><a href="https://twitchclone.com/account/create">Register on TwitchClone</a></b>\n\n` +
		`Thank you for being with us! We are always happy to have you on the platform. 🚀\n\n` +
		`Sincerely,\n` +
		`The TwitchClone Team`,
	streamStart: (channel: User) =>
		`<b>📡 A stream has started on ${channel.displayName}'s channel!</b>\n\n` +
		`Watch here: <a href="https://twitchclone.com/${channel.username}">Go to the stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>You have a new follower!</b>\n\nThis user is <a href="https://twitchclone.com/${follower.username}">${follower.displayName}</a>\n\nTotal followers on your channel: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 New sponsorship!</b>\n\n` +
		`You have received a new sponsorship for the plan <b>${plan.title}</b>.\n` +
		`💰 Amount: <b>${plan.price} $</b>\n` +
		`👤 Sponsor: <a href="https://teastream.ru/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Date of formation: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>`,
	enableTwoFactor:
		`🔐 Ensure your security!\n\n` +
		`Enable two-factor authentication in <a href="https://twitchclone.com/dashboard/settings">account settings</a>.`,
	verifyChannel:
		`<b>🎉 Congratulations! Your channel is verified</b>\n\n` +
		`We are pleased to inform you that your channel is now verified, and you have received the official badge.\n\n` +
		`The verification badge confirms the authenticity of your channel and increases viewer trust.\n\n` +
		`Thank you for being with us and continuing to grow your channel with TwitchClone!`,
	errorMessage: `<b>Error has been occured</b>`
}

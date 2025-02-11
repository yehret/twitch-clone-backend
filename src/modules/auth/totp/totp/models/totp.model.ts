import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TotpModel {
	@Field(() => String)
	public qrcodeURL: string

	@Field(() => String)
	public secret: string
}

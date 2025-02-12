import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
	private readonly client: S3Client
	private readonly bucket: string

	public constructor(private readonly configService: ConfigService) {
		this.client = new S3Client({
			endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
			region: this.configService.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId:
					this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.getOrThrow<string>(
					'S3_SECRET_ACCESS_KEY'
				)
			}
		})

		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
	}

	public async upload(buffer: Buffer, key: string, mimetype: string) {
		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: buffer,
			ContentType: mimetype
		}

		await this.client.send(new PutObjectCommand(command))
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key)
		}

		await this.client.send(new DeleteObjectCommand(command))
	}
}

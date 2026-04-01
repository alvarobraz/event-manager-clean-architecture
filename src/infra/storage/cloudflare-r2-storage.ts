import { Uploader, UploadParams } from '@/domain/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

export class CloudflareR2Storage implements Uploader {
  private client: S3Client

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? '',
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}

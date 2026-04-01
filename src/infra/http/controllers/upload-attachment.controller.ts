import { Request, Response } from 'express'
import { UploadAttachmentUseCase } from '@/application/use-cases/upload-attachment.use-case'
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-attachments-repository'
import { CloudflareR2Storage } from '@/infra/storage/cloudflare-r2-storage'

export class UploadAttachmentController {
  async handle(req: Request, res: Response) {
    const { file } = req

    if (!file) {
      return res.status(400).send({ message: 'File is required' })
    }

    const uploader = new CloudflareR2Storage()
    const attachmentsRepository = new PrismaAttachmentsRepository()
    const uploadAttachment = new UploadAttachmentUseCase(attachmentsRepository)

    const { url } = await uploader.upload({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    const result = await uploadAttachment.execute({
      title: file.originalname,
      url: url,
    })

    if (result.isLeft()) {
      return res.status(500).send({ message: 'Error saving attachment' })
    }

    return res.status(201).json({
      attachment: {
        id: result.value.attachment.id.toString(),
        url: result.value.attachment.url,
      },
    })
  }
}

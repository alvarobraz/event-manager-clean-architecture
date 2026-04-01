import { Either, right } from '@/core/either'
import { Attachment } from '@/domain/entities/attachment'
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'

interface UploadAttachmentUseCaseRequest {
  title: string
  url: string
}

type UploadAttachmentUseCaseResponse = Either<never, { attachment: Attachment }>

export class UploadAttachmentUseCase {
  constructor(private attachmentsRepository: AttachmentsRepository) {}

  async execute({
    title,
    url,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    const attachment = Attachment.create({
      title,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}

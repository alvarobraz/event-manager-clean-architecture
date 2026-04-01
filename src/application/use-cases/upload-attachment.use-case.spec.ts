import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAttachmentUseCase } from './upload-attachment.use-case'

let attachmentsRepository: InMemoryAttachmentsRepository
let sut: UploadAttachmentUseCase

describe('Upload Attachment Use Case', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    sut = new UploadAttachmentUseCase(attachmentsRepository)
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      title: 'banner-evento.png',
      url: 'https://storage.com/banner-evento.png',
    })

    expect(result.isRight()).toBe(true)
    expect(attachmentsRepository.items).toHaveLength(1)
    if (result.isRight()) {
      expect(attachmentsRepository.items[0].title).toBe('banner-evento.png')
    }
  })
})

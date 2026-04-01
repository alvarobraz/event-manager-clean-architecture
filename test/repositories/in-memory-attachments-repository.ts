import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'
import { Attachment } from '@/domain/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async findById(id: string) {
    const attachment = this.items.find((item) => item.id.toString() === id)
    return attachment ?? null
  }

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}

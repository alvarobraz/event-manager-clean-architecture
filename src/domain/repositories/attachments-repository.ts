import { Attachment } from '../entities/attachment'

export interface AttachmentsRepository {
  create(attachment: Attachment): Promise<void>
  findById(id: string): Promise<Attachment | null>
}

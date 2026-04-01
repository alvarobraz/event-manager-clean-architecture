import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'
import { Attachment } from '@/domain/entities/attachment'
import { prisma } from '../lib/prisma'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'

export class PrismaAttachmentsRepository implements AttachmentsRepository {
  async findById(id: string): Promise<Attachment | null> {
    const attachment = await prisma.attachment.findUnique({ where: { id } })
    if (!attachment) return null
    return PrismaAttachmentMapper.toDomain(attachment)
  }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)
    await prisma.attachment.create({ data })
  }
}

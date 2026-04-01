import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { Participant } from '@/domain/entities/participant'
import { prisma } from '../lib/prisma'
import { PrismaParticipantMapper } from '../mappers/prisma-participant-mapper'

export class PrismaParticipantsRepository implements ParticipantsRepository {
  async findById(id: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({ where: { id } })
    if (!participant) return null
    return PrismaParticipantMapper.toDomain(participant)
  }

  async findByEmail(email: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: { email },
    })
    if (!participant) return null
    return PrismaParticipantMapper.toDomain(participant)
  }

  async findByPhone(phone: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: { phone },
    })
    if (!participant) return null
    return PrismaParticipantMapper.toDomain(participant)
  }

  async create(participant: Participant): Promise<void> {
    const data = PrismaParticipantMapper.toPrisma(participant)
    await prisma.participant.create({ data })
  }
}

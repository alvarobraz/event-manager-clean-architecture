import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { Registration } from '@/domain/entities/registration'
import { prisma } from '../lib/prisma'
import { PrismaRegistrationMapper } from '../mappers/prisma-registration-mapper'

export class PrismaRegistrationsRepository implements RegistrationsRepository {
  async findByEventAndParticipant(eventId: string, participantId: string) {
    const registration = await prisma.registration.findFirst({
      where: {
        eventId,
        participantId,
      },
    })

    if (!registration) return null

    return PrismaRegistrationMapper.toDomain(registration)
  }

  async findManyByEventId(eventId: string): Promise<Registration[]> {
    const registrations = await prisma.registration.findMany({
      where: { eventId },
    })
    return registrations.map(PrismaRegistrationMapper.toDomain)
  }

  async create(registration: Registration): Promise<void> {
    const data = PrismaRegistrationMapper.toPrisma(registration)
    await prisma.registration.create({ data })
  }
}

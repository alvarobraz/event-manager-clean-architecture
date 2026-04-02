import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { Registration } from '@/domain/entities/registration'
import { prisma } from '../lib/prisma'
import { PrismaRegistrationMapper } from '../mappers/prisma-registration-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

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

  async findManyByEventId(
    eventId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<Registration[]> {
    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        registeredAt: 'asc',
      },
    })

    return registrations.map(PrismaRegistrationMapper.toDomain)
  }

  async create(registration: Registration): Promise<void> {
    const data = PrismaRegistrationMapper.toPrisma(registration)
    await prisma.registration.create({ data })
  }
}

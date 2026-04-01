import { EventsRepository } from '@/domain/repositories/events-repository'
import { Event } from '@/domain/entities/event'
import { prisma } from '../lib/prisma'
import { PrismaEventMapper } from '../mappers/prisma-event-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class PrismaEventsRepository implements EventsRepository {
  async findById(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return null
    return PrismaEventMapper.toDomain(event)
  }

  async findByName(name: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({ where: { name } })
    if (!event) return null
    return PrismaEventMapper.toDomain(event)
  }

  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event)
    await prisma.event.create({ data })
  }

  async save(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event)
    await prisma.event.update({
      where: { id: data.id },
      data,
    })
  }

  async listAll({ page, pageSize }: PaginationParams): Promise<Event[]> {
    const events = await prisma.event.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return events.map(PrismaEventMapper.toDomain)
  }
}

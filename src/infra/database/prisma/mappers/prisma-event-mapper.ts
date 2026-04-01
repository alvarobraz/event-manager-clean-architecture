import { Event as PrismaEvent } from '@prisma/client'
import { Event } from '@/domain/entities/event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        name: raw.name,
        description: raw.description,
        date: raw.date,
        bannerImageId: raw.bannerImageId
          ? new UniqueEntityID(raw.bannerImageId)
          : null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(event: Event): PrismaEvent {
    return {
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      date: event.date,
      bannerImageId: event.bannerImageId
        ? event.bannerImageId.toString()
        : null,
      createdAt: event.createdAt,
    }
  }
}

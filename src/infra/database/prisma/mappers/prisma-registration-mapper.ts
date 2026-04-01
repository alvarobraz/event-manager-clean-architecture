import { Registration as PrismaRegistration } from '@prisma/client'
import { Registration } from '@/domain/entities/registration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaRegistrationMapper {
  static toDomain(raw: PrismaRegistration): Registration {
    return Registration.create(
      {
        eventId: new UniqueEntityID(raw.eventId),
        participantId: new UniqueEntityID(raw.participantId),
        registeredAt: raw.registeredAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(registration: Registration): PrismaRegistration {
    return {
      id: registration.id.toString(),
      eventId: registration.eventId.toString(),
      participantId: registration.participantId.toString(),
      registeredAt: registration.registeredAt,
    }
  }
}

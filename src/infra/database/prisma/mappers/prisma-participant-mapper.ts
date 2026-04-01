import { Participant as PrismaParticipant } from '@prisma/client'
import { Participant } from '@/domain/entities/participant'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/value-objects/email'

export class PrismaParticipantMapper {
  static toDomain(raw: PrismaParticipant): Participant {
    return Participant.create(
      {
        name: raw.name,
        email: Email.create(raw.email),
        phone: raw.phone,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(participant: Participant): PrismaParticipant {
    return {
      id: participant.id.toString(),
      name: participant.name,
      email: participant.email.getValue(),
      phone: participant.phone,
      createdAt: participant.createdAt,
    }
  }
}

import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { Registration } from '@/domain/entities/registration'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryRegistrationsRepository implements RegistrationsRepository {
  public items: Registration[] = []

  async findByEventAndParticipant(eventId: string, participantId: string) {
    const registration = this.items.find((item) => {
      return (
        item.eventId.toString() === eventId &&
        item.participantId.toString() === participantId
      )
    })

    return registration ?? null
  }

  async findManyByEventId(
    eventId: string,
    { page, pageSize }: PaginationParams,
  ) {
    const registrations = this.items
      .filter((item) => item.eventId.toString() === eventId)
      .slice((page - 1) * pageSize, page * pageSize)

    return registrations
  }

  async create(registration: Registration) {
    this.items.push(registration)
  }
}

import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { Registration } from '@/domain/entities/registration'

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

  async findManyByEventId(eventId: string) {
    return this.items.filter((item) => item.eventId.toString() === eventId)
  }

  async create(registration: Registration) {
    this.items.push(registration)
  }
}

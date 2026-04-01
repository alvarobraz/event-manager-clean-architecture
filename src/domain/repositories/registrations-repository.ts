import { Registration } from '../entities/registration'

export interface RegistrationsRepository {
  findByEventAndParticipant(
    eventId: string,
    participantId: string,
  ): Promise<Registration | null>
  findManyByEventId(eventId: string): Promise<Registration[]>
  create(registration: Registration): Promise<void>
}

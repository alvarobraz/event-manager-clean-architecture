import { PaginationParams } from '@/core/repositories/pagination-params'
import { Registration } from '../entities/registration'

export interface RegistrationsRepository {
  findByEventAndParticipant(
    eventId: string,
    participantId: string,
  ): Promise<Registration | null>
  findManyByEventId(
    eventId: string,
    params: PaginationParams,
  ): Promise<Registration[]>
  create(registration: Registration): Promise<void>
}

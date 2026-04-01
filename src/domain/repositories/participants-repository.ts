import { Participant } from '../entities/participant'

export interface ParticipantsRepository {
  findById(id: string): Promise<Participant | null>
  findByEmail(email: string): Promise<Participant | null>
  findByPhone(phone: string): Promise<Participant | null>
  create(participant: Participant): Promise<void>
}

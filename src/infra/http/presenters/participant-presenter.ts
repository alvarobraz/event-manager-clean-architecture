import { Participant } from '@/domain/entities/participant'

export class ParticipantPresenter {
  static toHTTP(participant: Participant) {
    return {
      id: participant.id.toString(),
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      created_at: participant.createdAt,
    }
  }
}

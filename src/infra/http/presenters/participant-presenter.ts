import { Attachment } from '@/domain/entities/attachment'
import { Participant } from '@/domain/entities/participant'

export class ParticipantPresenter {
  static toHTTP(item: {
    participant: Participant
    attachment: Attachment | null
  }) {
    return {
      id: item.participant.id.toString(),
      name: item.participant.name,

      avatarUrl: item.attachment
        ? `${process.env.APP_URL}/uploads/${item.attachment.url}`
        : null,
    }
  }
}

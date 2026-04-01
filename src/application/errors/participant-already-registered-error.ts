import { UseCaseError } from '@/core/errors/use-case-error'

export class ParticipantAlreadyRegisteredError
  extends Error
  implements UseCaseError
{
  constructor(participantId: string, eventId: string) {
    super(
      `Participant "${participantId}" is already registered in event "${eventId}".`,
    )
    this.name = 'ParticipantAlreadyRegisteredError'
  }
}

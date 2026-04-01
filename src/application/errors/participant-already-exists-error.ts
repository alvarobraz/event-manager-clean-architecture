import { UseCaseError } from '@/core/errors/use-case-error'

export class ParticipantAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Participant with identifier "${identifier}" already exists.`)
    this.name = 'ParticipantAlreadyExistsError'
  }
}

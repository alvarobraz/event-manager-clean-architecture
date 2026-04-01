import { Either, left, right } from '@/core/either'
import { Participant } from '@/domain/entities/participant'
import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { Email } from '@/domain/value-objects/email'
import { ParticipantAlreadyExistsError } from '../errors/participant-already-exists-error'

interface CreateParticipantUseCaseRequest {
  name: string
  email: string
  phone: string
}

type CreateParticipantUseCaseResponse = Either<
  ParticipantAlreadyExistsError | Error,
  { participant: Participant }
>

export class CreateParticipantUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

  async execute({
    name,
    email,
    phone,
  }: CreateParticipantUseCaseRequest): Promise<CreateParticipantUseCaseResponse> {
    const participantWithSameEmail =
      await this.participantsRepository.findByEmail(email)
    if (participantWithSameEmail) {
      return left(new ParticipantAlreadyExistsError(email))
    }

    const participantWithSamePhone =
      await this.participantsRepository.findByPhone(phone)
    if (participantWithSamePhone) {
      return left(new ParticipantAlreadyExistsError(phone))
    }

    try {
      const emailVO = Email.create(email)

      const participant = Participant.create({
        name,
        email: emailVO,
        phone,
      })

      await this.participantsRepository.create(participant)

      return right({ participant })
    } catch (error) {
      return left(error as Error)
    }
  }
}

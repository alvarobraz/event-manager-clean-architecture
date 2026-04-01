import { Either, left, right } from '@/core/either'
import { Registration } from '@/domain/entities/registration'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ParticipantAlreadyRegisteredError } from '../errors/participant-already-registered-error'

interface RegisterParticipantInEventUseCaseRequest {
  eventId: string
  participantId: string
}

type RegisterParticipantInEventUseCaseResponse = Either<
  ResourceNotFoundError | ParticipantAlreadyRegisteredError,
  { registration: Registration }
>

export class RegisterParticipantInEventUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private participantsRepository: ParticipantsRepository,
    private registrationsRepository: RegistrationsRepository,
  ) {}

  async execute({
    eventId,
    participantId,
  }: RegisterParticipantInEventUseCaseRequest): Promise<RegisterParticipantInEventUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)
    if (!event) {
      return left(new ResourceNotFoundError())
    }

    const participant =
      await this.participantsRepository.findById(participantId)
    if (!participant) {
      return left(new ResourceNotFoundError())
    }

    const alreadyRegistered =
      await this.registrationsRepository.findByEventAndParticipant(
        eventId,
        participantId,
      )

    if (alreadyRegistered) {
      return left(new ParticipantAlreadyRegisteredError(participantId, eventId))
    }

    const registration = Registration.create({
      eventId: event.id,
      participantId: participant.id,
    })

    await this.registrationsRepository.create(registration)

    return right({ registration })
  }
}

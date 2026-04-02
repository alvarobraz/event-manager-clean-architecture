import { Either, left, right } from '@/core/either'
import { Participant } from '@/domain/entities/participant'
import { Event } from '@/domain/entities/event'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/pagination-params'

interface FetchEventParticipantsRequest {
  eventId: string
  params: PaginationParams
}

type FetchEventParticipantsResponse = Either<
  ResourceNotFoundError,
  {
    event: Event
    participants: Participant[]
  }
>

export class FetchEventParticipantsUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private registrationsRepository: RegistrationsRepository,
    private participantsRepository: ParticipantsRepository,
  ) {}

  async execute({
    eventId,
    params,
  }: FetchEventParticipantsRequest): Promise<FetchEventParticipantsResponse> {
    const event = await this.eventsRepository.findById(eventId)
    if (!event) return left(new ResourceNotFoundError())

    const registrations = await this.registrationsRepository.findManyByEventId(
      eventId,
      params,
    )

    const participants = await Promise.all(
      registrations.map(async (reg) => {
        const participant = await this.participantsRepository.findById(
          reg.participantId.toString(),
        )
        return participant!
      }),
    )

    return right({
      event,
      participants,
    })
  }
}

import { Either, left, right } from '@/core/either'
import { Participant } from '@/domain/entities/participant'
import { Event } from '@/domain/entities/event'
import { Attachment } from '@/domain/entities/attachment'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { RegistrationsRepository } from '@/domain/repositories/registrations-repository'
import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/pagination-params'

interface FetchEventParticipantsRequest {
  eventId: string
  params: PaginationParams
}

type ParticipantWithAttachment = {
  participant: Participant
  attachment: Attachment | null
}

type FetchEventParticipantsResponse = Either<
  ResourceNotFoundError,
  {
    event: Event
    eventAttachment: Attachment | null
    participants: ParticipantWithAttachment[]
  }
>

export class FetchEventParticipantsUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private registrationsRepository: RegistrationsRepository,
    private participantsRepository: ParticipantsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    eventId,
    params,
  }: FetchEventParticipantsRequest): Promise<FetchEventParticipantsResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    const eventAttachment = event.bannerImageId
      ? await this.attachmentsRepository.findById(
          event.bannerImageId.toString(),
        )
      : null

    const registrations = await this.registrationsRepository.findManyByEventId(
      eventId,
      params,
    )

    const participants = await Promise.all(
      registrations.map(async (reg) => {
        const participant = await this.participantsRepository.findById(
          reg.participantId.toString(),
        )

        if (!participant) return null

        const attachment = participant.avatarId
          ? await this.attachmentsRepository.findById(
              participant.avatarId.toString(),
            )
          : null

        return {
          participant,
          attachment,
        }
      }),
    )

    return right({
      event,
      eventAttachment,
      participants: participants.filter(
        (item): item is ParticipantWithAttachment => item !== null,
      ),
    })
  }
}

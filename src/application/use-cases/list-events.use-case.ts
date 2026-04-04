import { Either, right } from '@/core/either'
import { Event } from '@/domain/entities/event'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

interface ListEventsRequest {
  params: PaginationParams
}

type EventWithAttachment = {
  event: Event
  attachment: {
    url: string
  } | null
}

type ListEventsResponse = Either<null, { events: EventWithAttachment[] }>

export class ListEventsUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({ params }: ListEventsRequest): Promise<ListEventsResponse> {
    const events = await this.eventsRepository.listAll(params)

    const eventsWithAttachments = await Promise.all(
      events.map(async (event) => {
        if (!event.bannerImageId) {
          return {
            event,
            attachment: null,
          }
        }

        const attachment = await this.attachmentsRepository.findById(
          event.bannerImageId.toString(),
        )

        return {
          event,
          attachment: attachment
            ? {
                url: attachment.url,
              }
            : null,
        }
      }),
    )

    return right({
      events: eventsWithAttachments,
    })
  }
}

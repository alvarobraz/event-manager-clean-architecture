import { Either, right } from '@/core/either'
import { Event } from '@/domain/entities/event'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

interface ListEventsRequest {
  params: PaginationParams
}

type ListEventsResponse = Either<null, { events: Event[] }>

export class ListEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({ params }: ListEventsRequest): Promise<ListEventsResponse> {
    const events = await this.eventsRepository.listAll(params)

    return right({
      events,
    })
  }
}

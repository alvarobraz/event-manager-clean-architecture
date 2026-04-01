import { Either, right } from '@/core/either'
import { Event } from '@/domain/entities/event'
import { EventsRepository } from '@/domain/repositories/events-repository'

type ListEventsResponse = Either<null, { events: Event[] }>

export class ListEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute(): Promise<ListEventsResponse> {
    const events = await this.eventsRepository.listAll()

    return right({
      events,
    })
  }
}

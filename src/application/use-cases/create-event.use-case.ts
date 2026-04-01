import { Either, right, left } from '@/core/either'
import { Event } from '@/domain/entities/event'
import { EventsRepository } from '@/domain/repositories/events-repository'
import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { PastDateError } from '../errors/past-date-error'
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateEventUseCaseRequest {
  name: string
  description: string
  date: Date
  bannerImageId?: string
}

type CreateEventUseCaseResponse = Either<
  EventAlreadyExistsError | PastDateError | Error,
  { event: Event }
>

export class CreateEventUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    name,
    description,
    date,
    bannerImageId,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const eventWithSameName = await this.eventsRepository.findByName(name)

    if (eventWithSameName) {
      return left(new EventAlreadyExistsError(name))
    }

    if (date < new Date()) {
      return left(new PastDateError(date))
    }

    if (bannerImageId) {
      const attachment =
        await this.attachmentsRepository.findById(bannerImageId)
      if (!attachment) {
        return left(new ResourceNotFoundError())
      }
    }

    try {
      const event = Event.create({
        name,
        description,
        date,
        bannerImageId: bannerImageId ? new UniqueEntityID(bannerImageId) : null,
      })

      await this.eventsRepository.create(event)

      return right({ event })
    } catch (error) {
      return left(error as Error)
    }
  }
}

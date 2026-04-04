import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { ListEventsUseCase } from './list-events.use-case'
import { Event } from '@/domain/entities/event'
import { Attachment } from '@/domain/entities/attachment'

// Mock simples do AttachmentsRepository
class InMemoryAttachmentsRepository {
  async findById() {
    return null
  }
  async create(_: Attachment): Promise<void> {}
}

let eventsRepo: InMemoryEventsRepository
let attachmentsRepo: InMemoryAttachmentsRepository
let sut: ListEventsUseCase

describe('List Events Use Case', () => {
  beforeEach(() => {
    eventsRepo = new InMemoryEventsRepository()
    attachmentsRepo = new InMemoryAttachmentsRepository()

    sut = new ListEventsUseCase(eventsRepo, attachmentsRepo)
  })

  it('should be able to list paginated events', async () => {
    for (let i = 1; i <= 3; i++) {
      await eventsRepo.create(
        Event.create({
          name: `Event ${i}`,
          description: `Description ${i}`,
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * i),
        }),
      )
    }

    const result = await sut.execute({
      params: { page: 1, pageSize: 2 },
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.events).toHaveLength(2)

      expect(result.value.events[0].event.name).toBe('Event 1')
      expect(result.value.events[1].event.name).toBe('Event 2')
    }

    const secondPageResult = await sut.execute({
      params: { page: 2, pageSize: 2 },
    })

    if (secondPageResult.isRight()) {
      expect(secondPageResult.value.events).toHaveLength(1)
      expect(secondPageResult.value.events[0].event.name).toBe('Event 3')
    }
  })

  it('should return an empty list when no events exist', async () => {
    const result = await sut.execute({
      params: { page: 1, pageSize: 10 },
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.events).toHaveLength(0)
    }
  })
})

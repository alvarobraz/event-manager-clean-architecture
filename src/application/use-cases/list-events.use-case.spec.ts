import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { ListEventsUseCase } from './list-events.use-case'
import { Event } from '@/domain/entities/event'

let eventsRepo: InMemoryEventsRepository
let sut: ListEventsUseCase

describe('List Events Use Case', () => {
  beforeEach(() => {
    eventsRepo = new InMemoryEventsRepository()
    sut = new ListEventsUseCase(eventsRepo)
  })

  it('should be able to list all events', async () => {
    await eventsRepo.create(
      Event.create({
        name: 'Event 01',
        description: 'Description 01',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }),
    )

    await eventsRepo.create(
      Event.create({
        name: 'Event 02',
        description: 'Description 02',
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
      }),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.events).toHaveLength(2)
      expect(result.value.events).toEqual([
        expect.objectContaining({ name: 'Event 01' }),
        expect.objectContaining({ name: 'Event 02' }),
      ])
    }
  })

  it('should return an empty list when no events exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.events).toHaveLength(0)
    }
  })
})

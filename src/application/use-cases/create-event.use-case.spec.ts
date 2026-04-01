import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { CreateEventUseCase } from './create-event.use-case'
import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { PastDateError } from '../errors/past-date-error'

let eventsRepository: InMemoryEventsRepository
let sut: CreateEventUseCase

describe('Create Event Use Case', () => {
  beforeEach(() => {
    eventsRepository = new InMemoryEventsRepository()
    sut = new CreateEventUseCase(eventsRepository)
  })

  it('should be able to create an event', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const result = await sut.execute({
      name: 'Workshop Clean Arch',
      description: 'Arquitetura e DDD na prática',
      date: tomorrow,
      bannerImageId: 'image-1',
    })

    expect(result.isRight()).toBe(true)
    expect(eventsRepository.items).toHaveLength(1)
    if (result.isRight()) {
      expect(eventsRepository.items[0].name).toBe('Workshop Clean Arch')
      expect(eventsRepository.items[0].bannerImageId).toBe('image-1')
    }
  })

  it('should not be able to create an event with a past date', async () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 7)

    const result = await sut.execute({
      name: 'Past Event',
      description: 'Invalid Date',
      date: pastDate,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PastDateError)
    expect(eventsRepository.items).toHaveLength(0)
  })

  it('should not be able to create an event with the same name', async () => {
    const eventName = 'Unique Event Name'
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await sut.execute({
      name: eventName,
      description: 'First description',
      date: tomorrow,
    })

    const result = await sut.execute({
      name: eventName,
      description: 'Second description',
      date: tomorrow,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EventAlreadyExistsError)
    expect(eventsRepository.items).toHaveLength(1)
  })

  it('should be able to create an event without bannerImageId', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const result = await sut.execute({
      name: 'Event without image',
      description: 'Simple description',
      date: tomorrow,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.event.bannerImageId).toBeNull()
    }
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryParticipantsRepository } from 'test/repositories/in-memory-participants-repository'
import { InMemoryRegistrationsRepository } from 'test/repositories/in-memory-registrations-repository'
import { FetchEventParticipantsUseCase } from './fetch-event-participants.use-case'
import { Event } from '@/domain/entities/event'
import { Participant } from '@/domain/entities/participant'
import { Registration } from '@/domain/entities/registration'
import { Email } from '@/domain/value-objects/email'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let eventsRepo: InMemoryEventsRepository
let participantsRepo: InMemoryParticipantsRepository
let registrationsRepo: InMemoryRegistrationsRepository
let sut: FetchEventParticipantsUseCase

describe('Fetch Event Participants Use Case', () => {
  beforeEach(() => {
    eventsRepo = new InMemoryEventsRepository()
    participantsRepo = new InMemoryParticipantsRepository()
    registrationsRepo = new InMemoryRegistrationsRepository()
    sut = new FetchEventParticipantsUseCase(
      eventsRepo,
      registrationsRepo,
      participantsRepo,
    )
  })

  it('should be able to fetch participants from a specific event', async () => {
    const event = Event.create({
      name: 'Node.js Conference',
      description: 'Backend event',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    await eventsRepo.create(event)

    const participant1 = Participant.create({
      name: 'Álvaro Braz',
      email: Email.create('alvaro@example.com'),
      phone: '41999999991',
      createdAt: new Date(),
    })
    const participant2 = Participant.create({
      name: 'John Doe',
      email: Email.create('john@example.com'),
      phone: '41999999992',
      createdAt: new Date(),
    })
    await participantsRepo.create(participant1)
    await participantsRepo.create(participant2)

    await registrationsRepo.create(
      Registration.create({
        eventId: event.id,
        participantId: participant1.id,
      }),
    )
    await registrationsRepo.create(
      Registration.create({
        eventId: event.id,
        participantId: participant2.id,
      }),
    )

    const result = await sut.execute({
      eventId: event.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.event.name).toBe('Node.js Conference')
      expect(result.value.participants).toHaveLength(2)
      expect(result.value.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Álvaro Braz' }),
          expect.objectContaining({ name: 'John Doe' }),
        ]),
      )
    }
  })

  it('should not be able to fetch participants from a non-existent event', async () => {
    const result = await sut.execute({
      eventId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an empty list if the event has no participants', async () => {
    const event = Event.create({
      name: 'Empty Event',
      description: 'No one here',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    await eventsRepo.create(event)

    const result = await sut.execute({
      eventId: event.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.participants).toHaveLength(0)
    }
  })
})

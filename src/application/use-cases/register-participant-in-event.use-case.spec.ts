import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryParticipantsRepository } from 'test/repositories/in-memory-participants-repository'
import { InMemoryRegistrationsRepository } from 'test/repositories/in-memory-registrations-repository'
import { RegisterParticipantInEventUseCase } from './register-participant-in-event.use-case'
import { Event } from '@/domain/entities/event'
import { Participant } from '@/domain/entities/participant'
import { Email } from '@/domain/value-objects/email'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ParticipantAlreadyRegisteredError } from '../errors/participant-already-registered-error'

let eventsRepo: InMemoryEventsRepository
let participantsRepo: InMemoryParticipantsRepository
let registrationsRepo: InMemoryRegistrationsRepository
let sut: RegisterParticipantInEventUseCase

describe('Register Participant In Event Use Case', () => {
  beforeEach(() => {
    eventsRepo = new InMemoryEventsRepository()
    participantsRepo = new InMemoryParticipantsRepository()
    registrationsRepo = new InMemoryRegistrationsRepository()
    sut = new RegisterParticipantInEventUseCase(
      eventsRepo,
      participantsRepo,
      registrationsRepo,
    )
  })

  it('should be able to register a participant in an event', async () => {
    const event = Event.create({
      name: 'Clean Architecture Summit',
      description: 'The best event for devs',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    await eventsRepo.create(event)

    const participant = Participant.create({
      name: 'Álvaro Braz',
      email: Email.create('alvaro@cwbcoding.com.br'),
      phone: '41999999999',
    })
    await participantsRepo.create(participant)

    const result = await sut.execute({
      eventId: event.id.toString(),
      participantId: participant.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(registrationsRepo.items).toHaveLength(1)
    if (result.isRight()) {
      expect(result.value.registration.eventId).toEqual(event.id)
    }
  })

  it('should not be able to register in a non-existent event', async () => {
    const result = await sut.execute({
      eventId: 'invalid-event',
      participantId: 'any-participant',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a participant twice in the same event', async () => {
    const event = Event.create({
      name: 'Workshop Node.js',
      description: 'Desc',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    await eventsRepo.create(event)

    const participant = Participant.create({
      name: 'Álvaro',
      email: Email.create('alvaro@example.com'),
      phone: '41988888888',
    })
    await participantsRepo.create(participant)

    await sut.execute({
      eventId: event.id.toString(),
      participantId: participant.id.toString(),
    })

    const result = await sut.execute({
      eventId: event.id.toString(),
      participantId: participant.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ParticipantAlreadyRegisteredError)
    expect(registrationsRepo.items).toHaveLength(1)
  })
})

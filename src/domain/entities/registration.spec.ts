import { expect, it, describe } from 'vitest'
import { Registration } from './registration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('Registration Entity', () => {
  it('should be able to create a new registration', () => {
    const eventId = new UniqueEntityID()
    const participantId = new UniqueEntityID()

    const registration = Registration.create({
      eventId,
      participantId,
    })

    expect(registration.id).toBeDefined()
    expect(registration.eventId).toBe(eventId)
    expect(registration.participantId).toBe(participantId)
    expect(registration.registeredAt).toBeInstanceOf(Date)
  })

  it('should be able to create a registration with a specific date', () => {
    const eventId = new UniqueEntityID()
    const participantId = new UniqueEntityID()
    const specificDate = new Date('2026-01-01T10:00:00Z')

    const registration = Registration.create({
      eventId,
      participantId,
      registeredAt: specificDate,
    })

    expect(registration.registeredAt).toEqual(specificDate)
  })
})

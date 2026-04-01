import { expect, it, describe } from 'vitest'
import { Event } from './event'

describe('Event Entity', () => {
  it('should be able to create a new event', () => {
    const event = Event.create({
      name: 'Workshop Clean Architecture',
      description: 'Aprofundando em DDD e SOLID',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    expect(event.id).toBeDefined()
    expect(event.name).toBe('Workshop Clean Architecture')
  })

  it('should not be able to create an event with a past date', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)

    expect(() => {
      Event.create({
        name: 'Evento Inválido',
        description: 'Descrição',
        date: pastDate,
      })
    }).toThrow('Event date cannot be in the past')
  })
})

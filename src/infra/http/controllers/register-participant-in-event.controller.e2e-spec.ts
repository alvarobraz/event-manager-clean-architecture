import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'
import { describe, it, expect } from 'vitest'

describe('Register Participant In Event (E2E)', () => {
  it('should be able to register a participant in an event', async () => {
    const event = await prisma.event.create({
      data: {
        name: 'Workshop de Clean Architecture',
        description: 'Aprenda DDD e Solid',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    const participant = await prisma.participant.create({
      data: {
        name: 'Álvaro Braz',
        email: 'alvaro.e2e@example.com',
        phone: '41999999999',
      },
    })

    const response = await request(app)
      .post(`/events/${event.id}/participants`)
      .send({
        participantId: participant.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('registration_id')

    const registrationOnDatabase = await prisma.registration.findFirst({
      where: {
        eventId: event.id,
        participantId: participant.id,
      },
    })

    expect(registrationOnDatabase).toBeTruthy()
  })

  it('should not be able to register twice', async () => {
    const event = await prisma.event.create({
      data: {
        name: 'Workshop de DDD',
        description: 'Aprenda DDD e Solid',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    const participant = await prisma.participant.create({
      data: {
        name: 'Tester',
        email: 'tester@test.com',
        phone: '4100000000',
      },
    })

    await request(app).post(`/events/${event.id}/participants`).send({
      participantId: participant.id,
    })

    const response = await request(app)
      .post(`/events/${event.id}/participants`)
      .send({
        participantId: participant.id,
      })

    expect(response.status).toBe(409)
  })
})

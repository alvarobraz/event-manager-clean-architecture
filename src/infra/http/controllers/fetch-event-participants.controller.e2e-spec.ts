import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'

describe('Fetch Event Participants (E2E)', () => {
  it('should be able to fetch participants from an event', async () => {
    const event = await prisma.event.create({
      data: {
        name: 'JS Experience',
        description: 'Frontend event',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    const p1 = await prisma.participant.create({
      data: { name: 'User 1', email: 'u1@test.com', phone: '41999999991' },
    })
    const p2 = await prisma.participant.create({
      data: { name: 'User 2', email: 'u2@test.com', phone: '41999999992' },
    })

    await request(app).post(`/events/${event.id}/participants`).send({
      participantId: p1.id,
    })

    await request(app).post(`/events/${event.id}/participants`).send({
      participantId: p2.id,
    })

    const response = await request(app).get(`/events/${event.id}/participants`)

    expect(response.status).toBe(200)
    expect(response.body.event.name).toBe('JS Experience')
    expect(response.body.participants).toHaveLength(2)
  })

  it('should be able to fetch paginated participants', async () => {
    const event = await prisma.event.create({
      data: {
        name: 'Paginated Event',
        description: 'Testing pagination',
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
      },
    })

    for (let i = 1; i <= 3; i++) {
      const participant = await prisma.participant.create({
        data: {
          name: `Participant ${i}`,
          email: `p${i}@pagination.com`,
          phone: `410000000${i}`,
        },
      })

      await request(app)
        .post(`/events/${event.id}/participants`)
        .send({ participantId: participant.id })
    }

    const response = await request(app)
      .get(`/events/${event.id}/participants`)
      .query({ page: 1, pageSize: 2 })

    expect(response.status).toBe(200)
    expect(response.body.participants).toHaveLength(2)
    expect(response.body.participants[0].name).toBe('Participant 1')
    expect(response.body.participants[1].name).toBe('Participant 2')

    const secondPageResponse = await request(app)
      .get(`/events/${event.id}/participants`)
      .query({ page: 2, pageSize: 2 })

    expect(secondPageResponse.status).toBe(200)
    expect(secondPageResponse.body.participants).toHaveLength(1)
    expect(secondPageResponse.body.participants[0].name).toBe('Participant 3')
  })

  it('should return 404 for a non-existent event', async () => {
    const response = await request(app).get(
      `/events/${crypto.randomUUID()}/participants`,
    )
    expect(response.status).toBe(404)
  })
})

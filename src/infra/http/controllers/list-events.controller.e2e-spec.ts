import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'

describe('List Events (E2E)', () => {
  it('should be able to list paginated events', async () => {
    await prisma.event.createMany({
      data: [
        {
          name: 'Evento Alpha',
          description: 'Desc Alpha',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
        {
          name: 'Evento Beta',
          description: 'Desc Beta',
          date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        },
        {
          name: 'Evento Gamma',
          description: 'Desc Gamma',
          date: new Date(Date.now() + 1000 * 60 * 60 * 72),
        },
      ],
    })

    const response = await request(app)
      .get('/events')
      .query({ page: 1, pageSize: 2 })

    expect(response.status).toBe(200)
    expect(response.body.events).toHaveLength(2)

    expect(typeof response.body.events[0].id).toBe('string')

    const secondPageResponse = await request(app)
      .get('/events')
      .query({ page: 2, pageSize: 2 })

    expect(secondPageResponse.status).toBe(200)
    expect(secondPageResponse.body.events).toHaveLength(1)
    expect(secondPageResponse.body.events[0].name).toBe('Evento Gamma')
  })

  it('should use default pagination values when none are provided', async () => {
    const response = await request(app).get('/events')

    expect(response.status).toBe(200)

    expect(Array.isArray(response.body.events)).toBe(true)
  })
})

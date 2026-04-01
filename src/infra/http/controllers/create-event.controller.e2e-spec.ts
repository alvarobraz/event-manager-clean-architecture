import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'

describe('Create Event (E2E)', () => {
  it('should be able to create an event', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        name: 'Novo Evento E2E',
        description: 'Descrição do evento de teste',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('event_id')

    const eventOnDatabase = await prisma.event.findUnique({
      where: { name: 'Novo Evento E2E' },
    })

    expect(eventOnDatabase).toBeTruthy()
  })

  it('should be able to create an event with attachment', async () => {
    const attachment = await prisma.attachment.create({
      data: {
        title: 'Documento de Apoio',
        url: 'http://link-do-storage.com/doc.pdf',
      },
    })

    const response = await request(app)
      .post('/events')
      .send({
        name: 'Evento com Anexo',
        description: 'Evento que possui um PDF',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bannerImageId: attachment.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('event_id')

    const eventWithAttachment = await prisma.event.findUnique({
      where: { id: response.body.event_id },
      include: {
        bannerImage: true,
      },
    })

    expect(eventWithAttachment).toBeTruthy()
    expect(eventWithAttachment?.bannerImageId).toBe(attachment.id)
  })

  it('should not be able to create an event with duplicate name', async () => {
    await request(app)
      .post('/events')
      .send({
        name: 'Evento Duplicado',
        description: 'Desc',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

    const response = await request(app)
      .post('/events')
      .send({
        name: 'Evento Duplicado',
        description: 'Desc',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

    expect(response.status).toBe(409)
  })
})

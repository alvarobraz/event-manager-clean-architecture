import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'

describe('Create Participant (E2E)', () => {
  it('should be able to create a participant', async () => {
    const response = await request(app).post('/participants').send({
      name: 'Álvaro Braz',
      email: 'alvaro@cwbcoding.com.br',
      phone: '41999999999',
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('participant_id')

    const participantOnDatabase = await prisma.participant.findUnique({
      where: { email: 'alvaro@cwbcoding.com.br' },
    })

    expect(participantOnDatabase).toBeTruthy()
    expect(participantOnDatabase?.name).toBe('Álvaro Braz')
  })

  it('should not be able to create a participant with duplicate email', async () => {
    await prisma.participant.create({
      data: {
        name: 'Existing User',
        email: 'duplicate@test.com',
        phone: '41888888888',
      },
    })

    const response = await request(app).post('/participants').send({
      name: 'New User',
      email: 'duplicate@test.com',
      phone: '41777777777',
    })

    expect(response.status).toBe(409)
    expect(response.body.message).toContain('already exists')
  })
})

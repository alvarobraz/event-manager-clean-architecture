import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryParticipantsRepository } from 'test/repositories/in-memory-participants-repository'
import { CreateParticipantUseCase } from './create-participant.use-case'
import { ParticipantAlreadyExistsError } from '../errors/participant-already-exists-error'

let participantsRepository: InMemoryParticipantsRepository
let sut: CreateParticipantUseCase

describe('Create Participant Use Case', () => {
  beforeEach(() => {
    participantsRepository = new InMemoryParticipantsRepository()
    sut = new CreateParticipantUseCase(participantsRepository)
  })

  it('should be able to create a participant', async () => {
    const result = await sut.execute({
      name: 'Álvaro Braz',
      email: 'alvaro@cwbcoding.com.br',
      phone: '41999999999',
    })

    expect(result.isRight()).toBe(true)
    expect(participantsRepository.items).toHaveLength(1)
    if (result.isRight()) {
      expect(result.value.participant.name).toBe('Álvaro Braz')
    }
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'duplicate@example.com'

    await sut.execute({
      name: 'User 1',
      email,
      phone: '41999999991',
    })

    const result = await sut.execute({
      name: 'User 2',
      email,
      phone: '41999999992',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ParticipantAlreadyExistsError)
  })

  it('should not be able to register with same phone twice', async () => {
    const phone = '41988888888'

    await sut.execute({
      name: 'User 1',
      email: 'user1@example.com',
      phone,
    })

    const result = await sut.execute({
      name: 'User 2',
      email: 'user2@example.com',
      phone,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ParticipantAlreadyExistsError)
  })

  it('should not be able to register with invalid email format', async () => {
    const result = await sut.execute({
      name: 'Invalid User',
      email: 'invalid-email',
      phone: '41977777777',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value.message).toBe('Invalid email address')
    }
  })
})

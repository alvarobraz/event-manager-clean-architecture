import { expect, it, describe } from 'vitest'
import { Participant } from './participant'
import { Email } from '../value-objects/email'

describe('Participant Entity', () => {
  it('should be able to create a new participant', () => {
    const email = Email.create('alvaro@cwbcoding.com.br')
    const participant = Participant.create({
      name: 'Álvaro Braz',
      email,
      phone: '41999999999',
    })

    expect(participant.name).toBe('Álvaro Braz')
    expect(participant.email.getValue()).toBe('alvaro@cwbcoding.com.br')
  })

  it('should not be able to create a participant with invalid email', () => {
    expect(() => {
      Email.create('invalid-email')
    }).toThrow('Invalid email address')
  })

  it('should not be able to create a participant with an invalid phone', () => {
    const email = Email.create('alvaro@cwbcoding.com.br')

    expect(() => {
      Participant.create({
        name: 'Álvaro Braz',
        email,
        phone: '123',
      })
    }).toThrow('Invalid phone number')
  })
})

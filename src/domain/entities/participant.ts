import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '../value-objects/email'

export interface ParticipantProps {
  name: string
  email: Email
  phone: string
  avatarId?: UniqueEntityID | null
  createdAt: Date
}

export class Participant extends Entity<ParticipantProps> {
  get name() {
    return this.props.name
  }
  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get avatarId() {
    return this.props.avatarId
  }

  get createdAt() {
    return this.props.createdAt
  }

  private constructor(props: ParticipantProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: ParticipantProps, id?: UniqueEntityID) {
    if (props.name.length < 2) {
      throw new Error('Participant name is too short')
    }

    if (props.phone.length < 8) {
      throw new Error('Invalid phone number')
    }

    const phoneRegex = /^\d{10,11}$/
    if (!phoneRegex.test(props.phone)) {
      throw new Error('Invalid phone number')
    }

    return new Participant(
      {
        ...props,
        avatarId: props.avatarId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}

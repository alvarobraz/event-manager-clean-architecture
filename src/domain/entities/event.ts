import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface EventProps {
  name: string
  description: string
  date: Date
  createdAt?: Date
}

export class Event extends Entity<EventProps> {
  get name() {
    return this.props.name
  }
  get description() {
    return this.props.description
  }
  get date() {
    return this.props.date
  }
  get createdAt() {
    return this.props.createdAt
  }

  private constructor(props: EventProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: EventProps, id?: UniqueEntityID) {
    if (props.date < new Date()) {
      throw new Error('Event date cannot be in the past')
    }

    if (props.name.length < 3) {
      throw new Error('Event name must have at least 3 characters')
    }

    const event = new Event(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return event
  }
}

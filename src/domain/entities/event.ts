import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface EventProps {
  name: string
  description: string
  bannerImageId?: UniqueEntityID | null
  date: Date
  createdAt: Date
}

export class Event extends Entity<EventProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    if (name.length < 3) {
      throw new Error('Event name must have at least 3 characters')
    }
    this.props.name = name
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get bannerImageId() {
    return this.props.bannerImageId
  }

  set bannerImageId(id: UniqueEntityID | undefined | null) {
    this.props.bannerImageId = id ?? null
  }

  get date() {
    return this.props.date
  }

  set date(date: Date) {
    if (date < new Date()) {
      throw new Error('Event date cannot be in the past')
    }
    this.props.date = date
  }

  get createdAt() {
    return this.props.createdAt
  }

  private constructor(props: EventProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(
    props: Optional<EventProps, 'createdAt' | 'bannerImageId'>,
    id?: UniqueEntityID,
  ) {
    if (props.date < new Date()) {
      throw new Error('Event date cannot be in the past')
    }

    if (props.name.length < 3) {
      throw new Error('Event name must have at least 3 characters')
    }

    const event = new Event(
      {
        ...props,
        bannerImageId: props.bannerImageId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return event
  }
}

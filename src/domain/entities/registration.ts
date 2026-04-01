import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RegistrationProps {
  eventId: UniqueEntityID
  participantId: UniqueEntityID
  registeredAt: Date
}

export class Registration extends Entity<RegistrationProps> {
  get eventId() {
    return this.props.eventId
  }
  get participantId() {
    return this.props.participantId
  }
  get registeredAt() {
    return this.props.registeredAt
  }

  private constructor(props: RegistrationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(
    props: Optional<RegistrationProps, 'registeredAt'>,
    id?: UniqueEntityID,
  ) {
    const registration = new Registration(
      {
        ...props,
        registeredAt: props.registeredAt ?? new Date(),
      },
      id,
    )

    return registration
  }
}

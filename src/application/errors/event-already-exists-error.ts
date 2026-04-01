import { UseCaseError } from '@/core/errors/use-case-error'

export class EventAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Event with name "${identifier}" already exists.`)
    this.name = 'EventAlreadyExistsError'
  }
}

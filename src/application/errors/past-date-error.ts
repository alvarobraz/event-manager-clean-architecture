import { UseCaseError } from '@/core/errors/use-case-error'

export class PastDateError extends Error implements UseCaseError {
  constructor(date: Date) {
    super(
      `The event date "${date.toLocaleDateString()}" cannot be in the past.`,
    )
    this.name = 'PastDateError'
  }
}

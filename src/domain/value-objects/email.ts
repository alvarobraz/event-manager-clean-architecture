export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    if (!this.validate(value)) {
      throw new Error('Invalid email address')
    }
    return new Email(value)
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  getValue(): string {
    return this.value
  }
}

import { ParticipantsRepository } from '@/domain/repositories/participants-repository'
import { Participant } from '@/domain/entities/participant'

export class InMemoryParticipantsRepository implements ParticipantsRepository {
  public items: Participant[] = []

  async findById(id: string) {
    const participant = this.items.find((item) => item.id.toString() === id)
    return participant ?? null
  }

  async findByEmail(email: string) {
    const participant = this.items.find(
      (item) => item.email.getValue() === email,
    )
    return participant ?? null
  }

  async findByPhone(phone: string) {
    const participant = this.items.find((item) => item.phone === phone)
    return participant ?? null
  }

  async create(participant: Participant) {
    this.items.push(participant)
  }
}

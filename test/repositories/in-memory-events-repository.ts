import { EventsRepository } from '@/domain/repositories/events-repository'
import { Event } from '@/domain/entities/event'

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = []

  async findById(id: string) {
    const event = this.items.find((item) => item.id.toString() === id)
    return event ?? null
  }

  async findByName(name: string) {
    const event = this.items.find((item) => item.name === name)
    return event ?? null
  }

  async create(event: Event) {
    this.items.push(event)
  }

  async save(event: Event) {
    const index = this.items.findIndex((item) => item.id.equals(event.id))
    this.items[index] = event
  }

  async listAll() {
    return this.items
  }
}

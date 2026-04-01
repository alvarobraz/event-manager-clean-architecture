import { Event } from '@/domain/entities/event'

export class EventPresenter {
  static toHTTP(event: Event) {
    return {
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      date: event.date,
      banner_image_id: event.bannerImageId,
      created_at: event.createdAt,
    }
  }
}

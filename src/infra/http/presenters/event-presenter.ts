import { Event } from '@/domain/entities/event'

export class EventPresenter {
  static toHTTP(event: Event, attachment?: { url: string } | null) {
    const baseUrl = process.env.CLOUDFLARE_PUBLIC_URL

    if (!baseUrl && attachment) {
      console.warn(
        `[WARN] CLOUDFLARE_PUBLIC_URL is not defined in environment variables!`,
      )
    }

    return {
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      date: event.date,
      created_at: event.createdAt,

      bannerImage: attachment
        ? {
            url: baseUrl ? `${baseUrl}/${attachment.url}` : attachment.url,
          }
        : null,
    }
  }
}

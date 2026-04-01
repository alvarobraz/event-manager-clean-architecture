import { Request, Response } from 'express'
import { z } from 'zod'
import { ListEventsUseCase } from '@/application/use-cases/list-events.use-case'
import { EventPresenter } from '../presenters/event-presenter'

const listEventsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
})

export class ListEventsController {
  constructor(private listEventsUseCase: ListEventsUseCase) {}

  async handle(req: Request, res: Response) {
    const { page, pageSize } = listEventsQuerySchema.parse(req.query)

    const result = await this.listEventsUseCase.execute({
      params: {
        page,
        pageSize,
      },
    })

    if (result.isLeft()) {
      return res.status(500).json({ message: 'Internal server error' })
    }

    const { events } = result.value

    return res.status(200).json({
      events: events.map(EventPresenter.toHTTP),
    })
  }
}

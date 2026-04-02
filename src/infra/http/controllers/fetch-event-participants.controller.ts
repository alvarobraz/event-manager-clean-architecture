import { Request, Response } from 'express'
import { z } from 'zod'
import { FetchEventParticipantsUseCase } from '@/application/use-cases/fetch-event-participants.use-case'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { EventPresenter } from '../presenters/event-presenter'
import { ParticipantPresenter } from '../presenters/participant-presenter'

const fetchEventParticipantsParamsSchema = z.object({
  eventId: z.string().uuid(),
})

export class FetchEventParticipantsController {
  constructor(
    private fetchEventParticipantsUseCase: FetchEventParticipantsUseCase,
  ) {}

  async handle(req: Request, res: Response) {
    const { eventId } = fetchEventParticipantsParamsSchema.parse(req.params)

    const result = await this.fetchEventParticipantsUseCase.execute({ eventId })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({ message: error.message })
      }

      return res.status(400).json({ message: error })
    }

    const { event, participants } = result.value

    return res.status(200).json({
      event: EventPresenter.toHTTP(event),
      participants: participants.map(ParticipantPresenter.toHTTP),
    })
  }
}

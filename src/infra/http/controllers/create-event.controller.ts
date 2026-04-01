import { Request, Response } from 'express'
import { PrismaEventsRepository } from '@/infra/database/prisma/repositories/prisma-events-repository'
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-attachments-repository'
import { CreateEventUseCase } from '@/application/use-cases/create-event.use-case'
import { EventAlreadyExistsError } from '@/application/errors/event-already-exists-error'
import { PastDateError } from '@/application/errors/past-date-error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'

export class CreateEventController {
  async handle(req: Request, res: Response) {
    const { name, description, date, bannerImageId } = req.body

    const eventsRepository = new PrismaEventsRepository()
    const attachmentsRepository = new PrismaAttachmentsRepository()

    const createEventUseCase = new CreateEventUseCase(
      eventsRepository,
      attachmentsRepository,
    )

    const result = await createEventUseCase.execute({
      name,
      description,
      date: new Date(date),
      bannerImageId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EventAlreadyExistsError:
          return res.status(409).send({ message: error.message })
        case PastDateError:
          return res.status(400).send({ message: error.message })
        case ResourceNotFoundError:
          return res.status(404).send({ message: 'Banner image not found' })
        default:
          return res.status(500).send({ message: 'Internal server error' })
      }
    }

    return res.status(201).json({
      event_id: result.value.event.id.toString(),
    })
  }
}

import { Request, Response } from 'express'
import { z } from 'zod'
import { RegisterParticipantInEventUseCase } from '@/application/use-cases/register-participant-in-event.use-case'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { ParticipantAlreadyRegisteredError } from '@/application/errors/participant-already-registered-error'

const registerParticipantParamsSchema = z.object({
  eventId: z.string().uuid(),
})

const registerParticipantBodySchema = z.object({
  participantId: z.string().uuid(),
})

export class RegisterParticipantInEventController {
  constructor(
    private registerParticipantInEventUseCase: RegisterParticipantInEventUseCase,
  ) {}

  async handle(req: Request, res: Response) {
    const { eventId } = registerParticipantParamsSchema.parse(req.params)
    const { participantId } = registerParticipantBodySchema.parse(req.body)

    const result = await this.registerParticipantInEventUseCase.execute({
      eventId,
      participantId,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({ message: error.message })
      }

      if (error instanceof ParticipantAlreadyRegisteredError) {
        return res.status(409).json({ message: error.message })
      }

      return res.status(400).json({ message: error })
    }

    const { registration } = result.value

    return res.status(201).json({
      registration_id: registration.id.toString(),
    })
  }
}

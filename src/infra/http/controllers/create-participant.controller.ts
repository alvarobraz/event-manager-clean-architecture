import { Request, Response } from 'express'
import { z } from 'zod'
import { CreateParticipantUseCase } from '@/application/use-cases/create-participant.use-case'
import { ParticipantAlreadyExistsError } from '@/application/errors/participant-already-exists-error'

const createParticipantBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
})

export class CreateParticipantController {
  constructor(private createParticipantUseCase: CreateParticipantUseCase) {}

  async handle(req: Request, res: Response) {
    const { name, email, phone } = createParticipantBodySchema.parse(req.body)

    const result = await this.createParticipantUseCase.execute({
      name,
      email,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ParticipantAlreadyExistsError) {
        return res.status(409).json({ message: error.message })
      }

      return res.status(400).json({ message: error.message })
    }

    const { participant } = result.value

    return res.status(201).json({
      participant_id: participant.id.toString(),
    })
  }
}

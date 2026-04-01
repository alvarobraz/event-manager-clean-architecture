import { Router } from 'express'
import multer from 'multer'
import { CreateEventController } from './controllers/create-event.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { ListEventsUseCase } from '../../application/use-cases/list-events.use-case'
import { ListEventsController } from './controllers/list-events.controller'
import { PrismaEventsRepository } from '../database/prisma/repositories/prisma-events-repository'
import { PrismaParticipantsRepository } from '../database/prisma/repositories/prisma-participants-repository'
import { CreateParticipantUseCase } from '@/application/use-cases/create-participant.use-case'
import { CreateParticipantController } from './controllers/create-participant.controller'

const routes = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

const createEventController = new CreateEventController()
const uploadAttachmentController = new UploadAttachmentController()
const eventsRepository = new PrismaEventsRepository()
const listEventsUseCase = new ListEventsUseCase(eventsRepository)
const listEventsController = new ListEventsController(listEventsUseCase)

const participantsRepository = new PrismaParticipantsRepository()
const createParticipantUseCase = new CreateParticipantUseCase(
  participantsRepository,
)
const createParticipantController = new CreateParticipantController(
  createParticipantUseCase,
)

routes.post('/events', (req, res) => createEventController.handle(req, res))
routes.post('/attachments', upload.single('file'), (req, res) =>
  uploadAttachmentController.handle(req, res),
)
routes.get('/events', (req, res) => listEventsController.handle(req, res))
routes.post('/participants', (req, res) =>
  createParticipantController.handle(req, res),
)

export { routes }

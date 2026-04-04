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
import { PrismaRegistrationsRepository } from '../database/prisma/repositories/prisma-registrations-repository'
import { RegisterParticipantInEventUseCase } from '@/application/use-cases/register-participant-in-event.use-case'
import { RegisterParticipantInEventController } from './controllers/register-participant-in-event.controller'
import { FetchEventParticipantsUseCase } from '@/application/use-cases/fetch-event-participants.use-case'
import { FetchEventParticipantsController } from './controllers/fetch-event-participants.controller'
import { PrismaAttachmentsRepository } from '../database/prisma/repositories/prisma-attachments-repository'

const routes = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

const createEventController = new CreateEventController()
const uploadAttachmentController = new UploadAttachmentController()
const eventsRepository = new PrismaEventsRepository()
const attachmentsRepository = new PrismaAttachmentsRepository()
const listEventsUseCase = new ListEventsUseCase(
  eventsRepository,
  attachmentsRepository,
)
const listEventsController = new ListEventsController(listEventsUseCase)

const participantsRepository = new PrismaParticipantsRepository()
const createParticipantUseCase = new CreateParticipantUseCase(
  participantsRepository,
)
const createParticipantController = new CreateParticipantController(
  createParticipantUseCase,
)

const registrationsRepository = new PrismaRegistrationsRepository()
const registerParticipantInEventUseCase = new RegisterParticipantInEventUseCase(
  eventsRepository,
  participantsRepository,
  registrationsRepository,
)
const registerParticipantInEventController =
  new RegisterParticipantInEventController(registerParticipantInEventUseCase)

const fetchEventParticipantsUseCase = new FetchEventParticipantsUseCase(
  eventsRepository,
  registrationsRepository,
  participantsRepository,
  attachmentsRepository,
)
const fetchEventParticipantsController = new FetchEventParticipantsController(
  fetchEventParticipantsUseCase,
)

routes.post('/events', (req, res) => createEventController.handle(req, res))
routes.post('/attachments', upload.single('file'), (req, res) =>
  uploadAttachmentController.handle(req, res),
)
routes.get('/events', (req, res) => listEventsController.handle(req, res))
routes.post('/participants', (req, res) =>
  createParticipantController.handle(req, res),
)

routes.post('/events/:eventId/participants', (req, res) =>
  registerParticipantInEventController.handle(req, res),
)

routes.get('/events/:eventId/participants', (req, res) =>
  fetchEventParticipantsController.handle(req, res),
)

export { routes }

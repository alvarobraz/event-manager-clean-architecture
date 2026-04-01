import { Router } from 'express'
import multer from 'multer'
import { CreateEventController } from './controllers/create-event.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { ListEventsUseCase } from '../../application/use-cases/list-events.use-case'
import { ListEventsController } from './controllers/list-events.controller'
import { PrismaEventsRepository } from '../database/prisma/repositories/prisma-events-repository'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

const createEventController = new CreateEventController()
const uploadAttachmentController = new UploadAttachmentController()
const eventsRepository = new PrismaEventsRepository()
const listEventsUseCase = new ListEventsUseCase(eventsRepository)
const listEventsController = new ListEventsController(listEventsUseCase)

router.post('/events', (req, res) => createEventController.handle(req, res))
router.post('/attachments', upload.single('file'), (req, res) =>
  uploadAttachmentController.handle(req, res),
)
router.get('/events', (req, res) => listEventsController.handle(req, res))

export { router }

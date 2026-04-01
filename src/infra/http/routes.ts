import { Router } from 'express'
import multer from 'multer'
import { CreateEventController } from './controllers/create-event.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

const createEventController = new CreateEventController()
const uploadAttachmentController = new UploadAttachmentController()

router.post('/events', (req, res) => createEventController.handle(req, res))
router.post('/attachments', upload.single('file'), (req, res) =>
  uploadAttachmentController.handle(req, res),
)

export { router }

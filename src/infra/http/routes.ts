import { Router } from 'express'
import { CreateEventController } from './controllers/create-event.controller'

const router = Router()
const createEventController = new CreateEventController()

router.post('/events', (req, res) => createEventController.handle(req, res))

export { router }

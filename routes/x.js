import { Router } from 'express'
import { login, onCallback, post } from '../controllers/x.js'

const router = Router()

router.get('/x/login', login)
    .get('/x/callback', onCallback)
    .post('/x/post', post)

export default router
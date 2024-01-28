import { Router } from 'express'
import { loginToX, onCallbackX, tweetX } from '../controllers/x.js'

const router = Router()

router.get('/x/login', loginToX)
    .get('/x/callback', onCallbackX)
    .post('/x/post', tweetX)

export default router
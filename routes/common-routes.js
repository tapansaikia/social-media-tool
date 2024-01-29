import { Router } from 'express'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from 'crypto'

const router = Router()

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

const docClient = DynamoDBDocumentClient.from(client)

router.post('/add-post', async (req, res) => {
    if (!req.cookies.token)
        return res.status(401).json({ error: "Unauthorized" })

    const { postBody, timestamp, postTo } = req.body
    const token = req.cookies.token
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            postId: randomUUID(),
            token,
            timestamp,
            postBody,
            postTo
        }
    }

    try {
        const command = new PutCommand(params)
        const response = await docClient.send(command)
        console.log("Post Saved Successfully")
        res.json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

export default router
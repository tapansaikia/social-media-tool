import { Router } from 'express'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

router.post('/add-post', async (req, res) => {
    if (!req.cookies.token)
        return res.status(401).json({ error: "Unauthorized" })

    const { postBody, post_timestamp = new Date().getTime(), postTo } = req.body
    const token = req.cookies.token
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            postId: randomUUID(),
            token,
            post_timestamp,
            postBody,
            postTo,
            isPosted: false
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

router.get('/get-posts', async (req, res) => {
    if (!req.cookies.token)
        return res.status(401).json({ error: "Unauthorized" })

    const token = req.cookies.token

    const params = {
        TableName: "Posts",
        FilterExpression: "#t = :value", // Specify the filter expression
        ExpressionAttributeNames: {
            "#t": "token"
        },
        ExpressionAttributeValues: {
            ":value": token, // Specify the value to filter
        },
    }
    try {
        const command = new ScanCommand(params)
        const response = await docClient.send(command)
        console.log(response)
        res.json(response.Items)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

export default router
import { Router } from 'express'
import AWS from 'aws-sdk'
import { randomUUID } from 'crypto'

const router = Router()


AWS.config.update({ region: process.env.AWS_REGION });

const DynamoDB = new AWS.DynamoDB({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

router.post('/add-post', async (req, res) => {
    if (!req.cookies.token)
        return res.status(401).json({ error: "Unauthorized" })

    const { postBody, timestamp, postFrom } = req.body
    const token = req.cookies.token
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            postId: {
                S: randomUUID()
            },
            token: {
                S:  token
            },
            timestamp: {
                S:  new Date(timestamp).getTime().toString()
            },
            postBody: {
                S: postBody
            },
            postFrom: {
                S: postFrom
            }
        }
    }

    try {
        const data = await DynamoDB.putItem(params).promise();
        console.log("Post Saved Successfully");
        res.json({ id: data.id });
      } catch (error) {
        return res.status(500).json({ error });
      }
})

export default router
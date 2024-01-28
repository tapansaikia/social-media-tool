import { Consumer } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'
import dotenv from 'dotenv'

dotenv.config()

const makePost = async ({ postTo, postBody, token }) => {
    const url = `http://localhost:3000/api/v1/${postTo}/post` // Update with your callback URL
    const data = {
        postBody,
        oauth_token: token
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error("Failed to post message", response);
        }

        const responseData = await response.json()
        console.log("Posted successfully", responseData.data)
    } catch (error) {
        console.error('Error:', error)
    }
}

const worker = Consumer.create({
  queueUrl: 'https://sqs.ap-south-1.amazonaws.com/590183911627/PostSchedulerQueue',
  handleMessage: async (message) => {
    await makePost(JSON.parse(message.Body))
  },
  sqs: new SQSClient()
})

worker.on('error', (err) => {
  console.error(err.message)
})

worker.on('processing_error', (err) => {
  console.error(err.message)
})

worker.on('timeout_error', (err) => {
  console.error(err.message)
})

worker.start()
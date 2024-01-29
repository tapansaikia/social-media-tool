import { CronJob } from 'cron'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import dotenv from 'dotenv'

dotenv.config()

const dynamoDbClient = new DynamoDBClient()
const sqsClient = new SQSClient({});

let startKey = null

const job = CronJob.from({
	cronTime: '* * * * * *',
	onTick: async function () {
    // scan DynamoDB for messages to post and send them to the queue
    const command = new ScanCommand({
      FilterExpression: "#isProcessed = :negative AND #ts <= :currentTime",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
        "#isProcessed": "isPosted",
      },
      ExpressionAttributeValues: {
        ":currentTime": { N: new Date().getTime().toString() },
        ":negative": { BOOL: false },
      },
      ExclusiveStartKey: startKey,
      TableName: "Posts",
    })

    try {
      const response = await dynamoDbClient.send(command)
      startKey = response.LastEvaluatedKey
      response.Items.forEach(async (item) => {
        // send message to SQS
        const command = new SendMessageCommand({
          QueueUrl: process.env.SQS_URL,
          DelaySeconds: 10,
          MessageBody: JSON.stringify({
            postBody: item.postBody.S,
            oauth_toke: item.token.S,
          }),
        })

        const response = await sqsClient.send(command);
        console.log("Message Queued Successfully", response)
      })
    } catch (e) {
      console.error("Error while scheduling message to SQS", e)
    }   
	},
	start: true
})

job.start()
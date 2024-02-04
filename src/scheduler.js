import { CronJob } from 'cron'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import dotenv from 'dotenv'
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

dotenv.config()

const dynamoDbClient = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(dynamoDbClient)
const sqsClient = new SQSClient({});

let startKey = null

const job = CronJob.from({
	cronTime: '* * * * * *',
	onTick: async function () {
    // scan DynamoDB for messages to post and send them to the queue
    const command = new ScanCommand({
      FilterExpression: "#isProcessed = :negative AND #ts <= :currentTime",
      ExpressionAttributeNames: {
        "#ts": "post_timestamp",
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

        const response = await sqsClient.send(command)
        console.log("Message Queued Successfully", response)

        // update the item in DynamoDB to mark it as processed
        const updateCommand = new UpdateCommand({
          TableName: "Posts",
          Key: {
            postId: item.postId.S,
          },
          UpdateExpression: "set isPosted = :posted",
          ExpressionAttributeValues: {
            ":posted": true,
          },
          ReturnValues: "ALL_NEW",
        })
      
        const updateResponse = await docClient.send(updateCommand)
        console.log("Item updated successfully", updateResponse)
      })
    } catch (e) {
      console.error("Error while scheduling message to SQS", e)
    }   
	},
	start: true
})

job.start()
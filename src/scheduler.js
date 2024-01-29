import { CronJob } from 'cron'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import dotenv from 'dotenv'

dotenv.config()

const client = new DynamoDBClient()

const docClient = DynamoDBDocumentClient.from(client)



const job = CronJob.from({
	cronTime: '* * * * * *',
	onTick: async function () {
		// console.log('You will see this message every second')
        // scan DynamoDB for messages to post and send them to the queue
        const command = new ScanCommand({
            // FilterExpression: "CrustType = :crustType",
            // For more information about data types,
            // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
            // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
            // ExpressionAttributeValues: {
            //   ":crustType": { S: "Graham Cracker" },
            // },
            // ProjectionExpression: "Flavor, CrustType, Description",
            TableName: "Posts",
          });
        
          const response = await client.send(command);
        //   response.Items.forEach(function (pie) {
        //     console.log(`${pie.Flavor.S} - ${pie.Description.S}\n`);
        //   });
        console.log(JSON.stringify(response))
	},
	start: true
})

job.start()
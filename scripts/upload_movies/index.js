import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { movies } from './movies.js'

const client = new DynamoDBClient({})
const doClient = DynamoDBDocumentClient.from(client)

const uploadMovies = async () => {
  try {
    for (const movie of movies) {
      const command = new PutCommand({
        TableName: 'movies',
        Item: {
          id: uuidv4(),
          ...movie,
        },
      })

      await doClient.send(command)
      console.log(`Successfully inserted movie: ${movie.title}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Data inserted Successfully'),
    }
  } catch (error) {
    console.log('Error inserting data', error)
    return {
      statusCode: 500,
      body: JSON.stringify('Error inserting data'),
    }
  }
}

uploadMovies()

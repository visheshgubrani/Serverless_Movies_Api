import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"
import { movies } from "./updated_movies.js"
import dotenv from "dotenv"

dotenv.config()

const client = new DynamoDBClient({})
const doClient = DynamoDBDocumentClient.from(client)

const uploadMovies = async () => {
  try {
    for (const movie of movies) {
      const command = new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
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
      body: JSON.stringify("Data inserted Successfully"),
    }
  } catch (error) {
    console.log("Error inserting data", error)
    return {
      statusCode: 500,
      body: JSON.stringify("Error inserting data"),
    }
  }
}

uploadMovies()

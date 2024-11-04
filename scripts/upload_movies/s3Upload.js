import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import axios from "axios"
import fs from "fs/promises"
import { movies } from "./movies.js"
import dotenv from "dotenv"

dotenv.config()

const s3Client = new S3Client({})

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const BUCKET_NAME = process.env.BUCKET_NAME

const serachMovie = async (title, year) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        year: year,
      },
    })

    return response.data.results[0]?.poster_path
  } catch (error) {
    console.log(`Error searching for ${title}:`, error.message)
    return null
  }
}

const downlaodImage = async (imageUrl, title) => {
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    })

    const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`
    await fs.writeFile(fileName, response.data)
    return fileName
  } catch (error) {
    console.log(`Error downloading image for ${title}:`, error.message)
    return null
  }
}

const uploadToS3 = async (fileName, fileContent) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: "image/jpeg",
    })

    await s3Client.send(command)
    console.log(`Successfully uploaded ${fileName} to ${BUCKET_NAME}`)
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`
  } catch (error) {
    console.log(`Error uploading ${fileName}:`, error.message)
    return null
  }
}

const processMovies = async () => {
  try {
    const updatedMovies = []
    for (const movie of movies) {
      console.log(`Processing ${movie.title}...`)

      // Search for movie poster
      const posterPath = await serachMovie(movie.title, movie.releaseYear)
      if (!posterPath) {
        console.log(`No poster found for ${movie.title}`)
        updatedMovies.push(movie)
        continue
      }

      // Download Image
      const imageUrl = `${TMDB_IMAGE_BASE_URL}${posterPath}`
      const fileName = await downlaodImage(imageUrl, movie.title)
      if (!fileName) {
        updatedMovies.push(movie)
        continue
      }

      // Read file and upload to S3
      const fileContent = await fs.readFile(fileName)
      const s3Url = await uploadToS3(fileName, fileContent)

      await fs.unlink(fileName)

      updatedMovies.push({
        ...movie,
        coverUrl: s3Url || movie.coverUrl,
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    await fs.writeFile(
      "updated_movies.js",
      `export const movies = ${JSON.stringify(updatedMovies, null, 2)}`
    )

    return {
      statusCode: 200,
      body: JSON.stringify("MOvie posters uploaded successfully"),
    }
  } catch (error) {
    console.log("Error processing movies:", error)
    return {
      statusCode: 500,
      body: JSON.stringify("Error processing movies"),
    }
  }
}

processMovies()

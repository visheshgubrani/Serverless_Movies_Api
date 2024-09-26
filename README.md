# Modular Serverless Movie API

A serverless API built on AWS to provide movie information, implemented using a modular approach with Terraform.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup and Deployment](#setup-and-deployment)
5. [API Endpoints](#api-endpoints)
6. [Data Model](#data-model)
7. [Usage Examples](#usage-examples)
8. [Contributing](#contributing)
9. [License](#license)

## Project Overview

This project implements a modular serverless API using AWS services to display and manage movie information. The API allows users to retrieve movie details, with infrastructure managed through Terraform modules.

## Technologies Used

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3
- Terraform
- Node.js

## Project Structure

```
modular-serverless-movie-project/
├── scripts/
│   └── upload_movies/
│       ├── node_modules/
│       ├── index.js
│       ├── movies.js
│       ├── package-lock.json
│       └── package.json
├── terraform/
│   ├── modules/
│   │   ├── apigateway/
│   │   ├── cors/
│   │   ├── dynamodb/
│   │   ├── iam/
│   │   ├── lambda/
│   │   └── s3/
│   ├── main.tf
│   ├── output.tf
│   ├── providers.tf
│   ├── terraform.tfstate
│   ├── terraform.tfstate.backup
│   └── vars.tf
├── .gitignore
└── README.md
```

## Setup and Deployment

### Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform installed
- Node.js and npm installed

### Steps

1. **Clone the repository**

   ```
   git clone https://github.com/yourusername/modular-serverless-movie-project.git
   cd modular-serverless-movie-project
   ```

2. **Configure AWS credentials**

   Ensure your AWS CLI is configured with the necessary permissions to create and manage the required AWS resources.

3. **Deploy infrastructure with Terraform**

   ```
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

   This will create the necessary AWS resources using the modular Terraform structure.

4. **Prepare and upload data**

   ```
   cd ../scripts/upload_movies
   npm install
   node index.js
   ```

   This script will upload your movie data to the DynamoDB table created by Terraform.

## API Endpoints

The specific endpoints will depend on your API Gateway configuration in Terraform. Typically, you might have:

1. **GetMovies**

   - URL: `GET /movies`
   - Description: Returns a JSON list of all movies in the database.

2. **GetMoviesByYear**

   - URL: `GET /movies/{year}`
   - Description: Returns a list of movies released in the specified year.

3. **GetMovieSummary**
   - URL: `GET /movies/{title}/summary`
   - Description: Returns details for the specified movie.

## Data Model

```json
{
  "title": "String",
  "releaseYear": "String",
  "genre": "String",
  "coverUrl": "String"
}
```

## Usage Examples

### Get all movies

```
GET https://your-api-id.execute-api.your-region.amazonaws.com/prod/movies
```

Response:

```json
[
  {
    "title": "Inception",
    "releaseYear": "2010",
    "genre": "Science Fiction, Action",
    "coverUrl": "https://your-s3-bucket.s3.your-region.amazonaws.com/inception.jpg"
  },
  {
    "title": "The Shawshank Redemption",
    "releaseYear": "1994",
    "genre": "Drama",
    "coverUrl": "https://your-s3-bucket.s3.your-region.amazonaws.com/shawshank.jpg"
  }
]
```

### Get movies by year

```
GET https://your-api-id.execute-api.your-region.amazonaws.com/prod/movies/2010
```

Response:

```json
[
  {
    "title": "Inception",
    "releaseYear": "2010",
    "genre": "Science Fiction, Action",
    "coverUrl": "https://your-s3-bucket.s3.your-region.amazonaws.com/inception.jpg"
  }
]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

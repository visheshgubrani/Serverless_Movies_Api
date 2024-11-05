# Serverless Movies API with AWS, Terraform, and Next.js

This project is a serverless movie database application built using AWS services, Terraform, and Next.js. The backend is powered by AWS Lambda, DynamoDB, and S3 for storage, while the frontend is hosted on CloudFront. Key features include listing movies, filtering by release year, and generating AI-powered summaries using Google Generative AI.

## Architecture Overview

The application consists of the following components:

- **Frontend**: A Next.js application hosted on S3 and served via CloudFront.
- **Backend**: Serverless architecture using AWS Lambda and API Gateway.
- **Database**: DynamoDB for movie data storage.
- **Storage**: S3 for movie cover images.
- **CDN**: CloudFront for content delivery.
- **AI Integration**: Google Generative AI for movie summaries.

## Acknowledgments

This project was inspired by a learning guide from [learntocloud.guide](https://learntocloud.guide/), which originally suggested building a set of AWS SDK-based APIs. However, I decided to expand the scope of the project to include Terraform for infrastructure as code and a Next.js frontend, in order to gain more experience with those technologies.

## Project Structure

```
├── .github/workflows     # CI/CD pipeline for deployment
├── frontend             # Next.js frontend
├── scripts              # Scripts for uploading initial movie data
├── terraform            # Terraform infrastructure as code
│   ├── modules          # Reusable Terraform modules
│   ├── backend.tf       # Backend configuration
│   ├── main.tf          # Main Terraform configuration
│   ├── terraform.tfvars # Variables for Terraform setup
│   ├── output.tf        # Terraform resource outputs
│   └── vars.tf          # Terraform input variables
├── .gitignore
└── README.md            # Project documentation
```

## Features

1. **Movie Listing**: Fetch a list of all movies stored in the DynamoDB database.
2. **Movie Filtering**: Filter movies by release year using the `/getmoviesbyyear/{year}` endpoint.
3. **AI-powered Summaries**: Generate AI-powered movie summaries using the `/getmoviesummary/{movieTitle}` endpoint.

## API Endpoints

1. **GetMovies**:

   - **URL:** `/getmovies`
   - Fetches a list of all movies stored in DynamoDB.

2. **GetMoviesByYear**:

   - **URL:** `/getmoviesbyyear/{year}`
   - Fetches movies filtered by release year.

3. **GetMovieSummary**:
   - **URL:** `/getmoviesummary/{movieTitle}`
   - Generates an AI-powered summary for a specific movie.

## Setup Instructions

For detailed instructions on how to set up and deploy this project, please follow the [Setup Guide](./SETUP.md). The guide covers:

- Configuring and deploying the backend infrastructure using Terraform.
- Uploading movie data to S3 and DynamoDB.
- Handling DNS validation for CloudFront with custom domains.
- Deploying the frontend application.

## CI/CD Pipeline

The project includes a GitHub Actions workflow that automates the deployment process. The pipeline performs the following tasks:

1. Builds and deploys the frontend to S3.
2. Deploys the backend infrastructure using Terraform.
3. Triggers Lambda function redeployments when API changes occur.

## Notes

- **DynamoDB Capacity**: The DynamoDB table is provisioned with 1 read/write unit. Adjust as necessary for your traffic.
- **CloudFront DNS Validation**: DNS validation for the custom domain may take time depending on your DNS provider.
- **Deployment Order**: Deploy the backend first to ensure the frontend can fetch movie data from the API.
- **Terraform Backend**: The state file will be stored in an S3 bucket.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please create a new issue or submit a pull request.

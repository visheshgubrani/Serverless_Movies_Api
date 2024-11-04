# Serverless Movies API with AWS, Terraform, and Next.js

This project is a serverless movie database application built with AWS, **Terraform**, and **Next.js**. The backend is powered by **AWS Lambda** functions, **DynamoDB**, and **S3** for storage, while the frontend is a Next.js application. It supports functionalities such as listing movies, filtering by release year, and generating AI-powered summaries of movies using **Google AI**.

## Project Structure

```bash
├── .github/workflows
│   └── main.yml               # CI/CD pipeline for deployment
├── frontend                   # Next.js frontend
├── scripts/upload_movies       # Upload script for initial movie data
│   ├── index.js
│   ├── movies.js
│   ├── package.json
├── terraform
│   ├── modules
│   │   ├── apigateway          # API Gateway setup
│   │   ├── cloudfront          # CloudFront setup for CDN and HTTPS
│   │   ├── cors                # CORS policy for the APIs
│   │   ├── dynamodb            # NoSQL database for storing movie data
│   │   ├── iam                 # IAM roles and policies
│   │   ├── lambda              # Lambda functions
│   │   └── s3                  # Cloud storage for movie cover images
│   ├── backend.tf
│   ├── main.tf                 # Main Terraform file
│   ├── output.tf               # Output resources after creation
│   ├── vars.tf                 # Variables used in Terraform
├── .gitignore
└── README.md                   # Project documentation
```

## Prerequisites

Before running this project, you will need:

- An AWS account.
- **Terraform** installed on your local machine.
- A custom domain configured on AWS Route 53 or another DNS provider. I'll be using namecheap
- **Google Generative AI API** access for the AI-powered movie summaries.
- **Node.js** and **npm** for running the Next.js frontend locally.

## Setup Instructions

### 1. Backend and Infrastructure Setup

The backend infrastructure (Lambda, API Gateway, DynamoDB, S3) needs to be set up first to ensure that the frontend can successfully load movie data.

Comment out the aws_acm_certificate_validation resource initially
Run terraform apply -target=module.cloudfront.aws_acm_certificate.cert
Get the validation records from the output
Add them to Namecheap
Uncomment the validation resource
Run full terraform apply

#### Clone the Repository

```bash
git clone https://github.com/visheshgubrani/movies-api-serverless.git
cd movies-api-serverless
```

#### Configure AWS Credentials

Make sure your AWS CLI is configured with the necessary credentials to create resources.

```bash
aws configure
```

#### Set Up Terraform Variables

There are two sensitive variables that need to be configured for Terraform:

- `tf_var_api_key`: This is your Google API Key for the movie summary generator.
- `tf_var_accountId`: Your AWS Account ID.

To make the setup easier, these values can be added either to:

1. GitHub secrets for CI/CD deployment.
2. A local `.tfvars` file for manual execution.

Create `terraform/terraform.tfvars` (if running locally):

```hcl
api_key = "<YOUR_GOOGLE_API_KEY>"
account_id = "<YOUR_AWS_ACCOUNT_ID>"
```

#### Update Bucket and CloudFront Domain

In the `terraform/modules/s3/main.tf`, update the bucket names as per your project:

```hcl
bucket = "your-custom-bucket-name"
```

In the `terraform/modules/cloudfront/main.tf`, update the custom domain name:

```hcl
custom_domain_name = "yourdomain.com"
```

You'll also need to ensure that DNS validation is done for the CloudFront setup. The Terraform output will provide values for DNS validation, and it may take some time to complete due to the nature of DNS changes.

#### Provision Infrastructure

Navigate to the `terraform/` directory and run the following commands:

```bash
cd terraform
terraform init
terraform apply
```

Wait for the infrastructure to provision. Once completed, Terraform will output the necessary values for DNS validation. Complete the DNS validation in your domain provider to ensure CloudFront is working with HTTPS.

### 2. Frontend Setup (Next.js)

Once the backend is fully deployed and running, set up the frontend.

#### Install Dependencies

Navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
```

#### Update API Endpoints

In the frontend configuration, update the API endpoints to match the API Gateway URL output from Terraform. You can find the API Gateway endpoint in the Terraform output.

Example in `frontend/config.js`:

```js
export const API_BASE_URL =
  "https://<api_gateway_id>.execute-api.<region>.amazonaws.com/"
```

#### Run the Frontend Locally

Once the API base URL is configured, you can run the Next.js application locally:

```bash
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### 3. Movie Data Upload

After the infrastructure is set up and the backend is live, you can upload movie data using the upload script in `scripts/upload_movies`.

First, install the dependencies:

```bash
cd scripts/upload_movies
npm install
```

Then run the script:

```bash
node index.js
```

This will upload the movie data to DynamoDB and the corresponding cover images to S3.

## AWS Services Used

1. **Amazon S3**: Storage for the movie cover images and frontend static assets.
2. **AWS Lambda**: Serverless functions to handle API requests.
3. **Amazon API Gateway**: API Gateway routes incoming requests to Lambda functions.
4. **Amazon DynamoDB**: NoSQL database to store movie data.
5. **Amazon CloudFront**: CDN for serving static assets and securing the frontend with HTTPS.
6. **AWS IAM**: Manages roles and permissions.

## API Endpoints

1. **GetMovies**

   - **URL:** `/getmovies`
   - Fetches a list of all movies stored in DynamoDB.

2. **GetMoviesByYear**

   - **URL:** `/getmoviesbyyear/{year}`
   - Fetches movies based on the release year passed as a parameter.

3. **GetMovieSummary**
   - **URL:** `/getmoviesummary/{movieTitle}`
   - Generates an AI-powered summary for the specified movie.

## Notes

- **Provisioned DynamoDB**: The DynamoDB table is currently set to provisioned capacity (1 read/write unit). This can be modified as needed to scale up based on traffic.
- **CloudFront DNS Validation**: DNS validation is required for the custom domain setup with CloudFront. This can take some time to propagate depending on your DNS provider.
- **Deployment Order**: Ensure that the backend infrastructure is fully set up and running before deploying the frontend. Otherwise, the frontend will show "Failed to load movies" if the backend API is not reachable.

## CI/CD Pipeline

The project includes a CI/CD pipeline using **GitHub Actions** that automates the deployment process. The pipeline is configured to:

- Build and deploy the frontend to S3.
- Deploy the backend infrastructure using Terraform.
- Ensure that API changes automatically trigger the redeployment of Lambda functions.

## License

This project is open-source and available under the [MIT License](LICENSE).

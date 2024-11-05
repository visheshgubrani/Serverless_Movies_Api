# Serverless Movies API Setup Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Initial Setup](#initial-setup)
- [Backend Deployment](#backend-deployment)
- [Data Population](#data-population)
- [Frontend Deployment](#frontend-deployment)
- [DNS Configuration](#dns-configuration)
- [Validation and Testing](#validation-and-testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- AWS CLI (v2.x+) configured with appropriate IAM permissions
- Terraform (v1.0.0+)
- Node.js (v20.x+)

### Required Accounts & API Keys

- Active AWS Account with administrator access
- TMDB API key for movie data
- Google Cloud Console account with Generative AI API enabled
- Domain name with access to DNS management

### Required AWS Permissions

- IAM permissions for creating/managing:
  - Lambda functions
  - API Gateway
  - DynamoDB
  - S3 buckets
  - CloudFront distributions
  - ACM certificates
  - Route 53 (if using AWS DNS)

## Architecture Overview

The application consists of:

- Frontend: Next.js application hosted on S3 and served via CloudFront
- Backend: Serverless architecture using AWS Lambda and API Gateway
- Database: DynamoDB for movie data storage
- Storage: S3 for movie cover images
- CDN: CloudFront for content delivery
- AI Integration: Google Generative AI for movie summaries

## Initial Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/visheshgubrani/serverless-movies-api.git
   cd serverless-movies-api
   ```

2. **Edit Configuration Files**

   ```bash
   # Create environment files
   mv scripts/upload_movies/.env.example scripts/upload_movies/.env
   mv frontend/.env.production frontend/.env
   ```

## Backend Deployment

### 1. Configure Terraform Variables

Edit `terraform/terraform.tfvars`:

```hcl
accountId                    = "your-aws-account-id"
myregion                     = "us-east-1"  # Preferred region
api_key                      = "your-google-ai-api-key"
root_domain                  = "yourdomain.com"
domain_aliases               = ["yourdomain.com", "*.yourdomain.com"]
certificate_sans             = ["*.yourdomain.com"]
cover_images_s3_bucket_name  = "your-images-bucket-name"
static_site_bucket_name      = "your-frontend-bucket-name"
```

### 2. Prepare Lambda Functions

```bash
# Install dependencies for all Lambda functions
for dir in terraform/modules/lambda/*/; do
    (cd "$dir" && npm ci)
done
```

### 3. Deploy Infrastructure

```bash
cd terraform/modules/cloudfront

# Comment out the aws_acm_certificate_validation resource and depends_on = [aws_acm_certificate_validation.cert] line in the CloudFront module resources.

cd ../..

# Initialize Terraform
terraform init

# Deploy ACM Certificate first
terraform apply -target=module.cloudfront.aws_acm_certificate.cert

# Wait for certificate validation
# Add validation records to your DNS provider

# Deploy remaining infrastructure
terraform apply
```

## Data Population

### 1. Configure Upload Scripts

Edit `scripts/upload_movies/.env`:

```env
TMDB_API_KEY=your-tmdb-api-key
BUCKET_NAME=your-images-bucket-name
DYNAMODB_TABLE_NAME=movies
```

### 2. Upload Movie Data

```bash
cd scripts/upload_movies

# Install dependencies
npm ci

# Upload cover images
node s3Upload.js

# Populate DynamoDB
node index.js
```

## Frontend Deployment

### 1. Configure Frontend

Edit `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=https://your_apigw_url/v1
```

### 2. Build and Deploy

```bash
cd frontend

# Install dependencies
npm ci

# Build application
npm run build

# Deploy to S3
aws s3 sync ./out s3://your-frontend-bucket-name --delete
```

## DNS Configuration

### If Using AWS Route 53

Create the following records:

- A/ALIAS record for root domain → CloudFront distribution
- CNAME record for www subdomain → CloudFront distribution

### If Using Another DNS Provider

Add the following records:

```
Type    Host    Value
ALIAS   @       <cloudfront-distribution-domain>
CNAME   www     <cloudfront-distribution-domain>
```

## Validation and Testing

1. **Verify Infrastructure**

   ```bash
   # Verify Lambda functions
   aws lambda list-functions --region us-east-1

   # Verify API Gateway
   aws apigateway get-rest-apis --region us-east-1
   ```

2. **Test API Endpoints**

   ```bash
   # Test movies endpoint
   curl https://api.yourdomain.com/movies

   # Test movie by year endpoint
   curl https://api.yourdomain.com/movies/year/2023
   ```

3. **Verify Frontend**
   - Access https://www.yourdomain.com
   - Verify movie listings load
   - Test AI summary generation

## Troubleshooting

### Common Issues

1. **Certificate Validation Failing**

   - Verify DNS records match ACM requirements
   - Ensure records have propagated (can take up to 48 hours)

2. **API Gateway 5XX Errors**

   - Check Lambda function logs in CloudWatch
   - Verify Lambda execution role permissions

3. **Images Not Loading**
   - Verify S3 bucket CORS configuration
   - Check CloudFront distribution settings
   - Confirm S3 bucket policy allows CloudFront access

### Debug Commands

```bash
# Check Lambda logs
aws logs tail /aws/lambda/getMovies --follow

# Validate CloudFront distribution
aws cloudfront get-distribution --id <distribution-id>

# Verify S3 bucket contents
aws s3 ls s3://your-bucket-name
```

For additional support or issues, please refer to the [GitHub repository](https://github.com/visheshgubrani/serverless-movies-api/issues).

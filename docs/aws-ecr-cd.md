# AWS ECR Image Publishing

This guide configures GitHub Actions to publish PaperHunt Docker images to Amazon ECR.

## What This Adds

- CI still validates the app and Docker builds.
- The `Publish Images to ECR` workflow manually builds and pushes:
  - `paperhunt-backend:<commit-sha>`
  - `paperhunt-frontend:<commit-sha>`
- GitHub authenticates to AWS using OIDC, so long-lived AWS access keys are not stored in GitHub.

## Local Prerequisite

Install AWS CLI v2, then verify:

```powershell
aws --version
```

Configure local AWS credentials for the setup commands:

```powershell
aws configure
```

Use the region you want for deployment. For India-based testing, `ap-south-1` is a reasonable starting point.

## Create ECR Repositories

Set your region in PowerShell:

```powershell
$env:AWS_REGION="ap-south-1"
```

Create the backend repository:

```powershell
aws ecr create-repository `
  --repository-name paperhunt-backend `
  --image-tag-mutability IMMUTABLE `
  --image-scanning-configuration scanOnPush=true `
  --region $env:AWS_REGION
```

Create the frontend repository:

```powershell
aws ecr create-repository `
  --repository-name paperhunt-frontend `
  --image-tag-mutability IMMUTABLE `
  --image-scanning-configuration scanOnPush=true `
  --region $env:AWS_REGION
```

## Create AWS Role for GitHub Actions

In AWS IAM, create an OIDC identity provider:

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

Create an IAM role that trusts that provider. Use this trust policy, replacing `<AWS_ACCOUNT_ID>` if needed:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ArihantSrivastava2225/PaperHunt:*"
        }
      }
    }
  ]
}
```

For learning, attach this managed policy to the role:

```txt
AmazonEC2ContainerRegistryPowerUser
```

Later, replace it with a least-privilege policy limited to the two PaperHunt ECR repositories.

## Configure GitHub

In GitHub, open:

```txt
Repository -> Settings -> Secrets and variables -> Actions
```

Add this repository variable:

```txt
AWS_REGION=ap-south-1
```

Add this repository secret:

```txt
AWS_ROLE_TO_ASSUME=arn:aws:iam::<AWS_ACCOUNT_ID>:role/<ROLE_NAME>
```

## Run the Workflow

Open:

```txt
GitHub -> Actions -> Publish Images to ECR -> Run workflow
```

After it succeeds, the two ECR repositories should contain images tagged with the commit SHA.

## Why SHA Tags

The workflow uses commit SHA tags instead of `latest`. This makes deployments reproducible because every Kubernetes deployment can point to an exact image version.

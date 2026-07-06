# PaperHunt EC2 Deployment

This guide deploys PaperHunt on one EC2 instance using ECR images and Docker Compose.

## Architecture

- EC2 runs Docker.
- `frontend` serves the React build through Nginx on port `80`.
- `frontend` proxies `/api` to the Compose service named `backend-service`.
- `backend-service` runs the Express API from the ECR backend image.
- `redis` runs as a private container with a persistent Docker volume.
- MongoDB should use MongoDB Atlas through `MONGO_URI`.

## AWS Console Setup

Use the same AWS region as ECR:

```txt
eu-north-1
```

Create an IAM role for the EC2 instance:

```txt
Role name: PaperHuntEC2ECRPullRole
Trusted entity: AWS service -> EC2
Policy: AmazonEC2ContainerRegistryReadOnly
```

Launch an EC2 instance:

```txt
AMI: Amazon Linux 2023
Instance type: t3.micro or the free-tier-labelled option shown in your account
IAM instance profile: PaperHuntEC2ECRPullRole
Storage: 20-30 GiB gp3
```

Security group inbound rules:

```txt
SSH   22   Your IP only
HTTP  80   0.0.0.0/0
HTTPS 443  0.0.0.0/0
```

Do not expose backend port `5000`, Redis port `6379`, or MongoDB port `27017`.

## Install Docker On EC2

SSH into the instance, then run:

```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

Log out and SSH back in, then verify:

```bash
docker ps
docker compose version
```

## Prepare App Files On EC2

Create the app directory:

```bash
mkdir -p ~/paperhunt
cd ~/paperhunt
```

Copy `deploy/ec2/docker-compose.prod.yml` to this folder as:

```txt
docker-compose.yml
```

Create a server-only `.env` file from `deploy/ec2/env.example`.

For the first HTTP smoke test, use:

```txt
CLIENT_URL=http://your-ec2-public-ip
COOKIE_SECURE=false
```

After domain and HTTPS are configured, change them to:

```txt
CLIENT_URL=https://your-domain
COOKIE_SECURE=true
```

## Login To ECR

Run this on the EC2 instance:

```bash
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 813562480144.dkr.ecr.eu-north-1.amazonaws.com
```

The EC2 IAM role provides permission to pull private ECR images.

## Start PaperHunt

```bash
docker compose pull
docker compose up -d
docker compose ps
```

View logs:

```bash
docker compose logs -f backend-service
docker compose logs -f frontend
```

Open:

```txt
http://your-ec2-public-ip
```

## Update Deployment

When GitHub Actions publishes a new ECR image, update `IMAGE_TAG` in `.env`, then run:

```bash
docker compose pull
docker compose up -d
```

# PaperHunt EC2 Deployment

This guide deploys PaperHunt on one EC2 instance using ECR images and Docker Compose.

## Architecture

- EC2 runs Docker.
- `caddy` is the public reverse proxy on ports `80` and `443`.
- `caddy` automatically obtains and renews HTTPS certificates for your domain.
- `frontend` serves the React build through Nginx inside the private Compose network.
- `caddy` proxies `/api` to the Compose service named `backend-service`.
- `backend-service` runs the Express API from the ECR backend image.
- `redis` runs as a private container with a persistent Docker volume by default.
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

Copy `deploy/ec2/Caddyfile` to the same folder as:

```txt
Caddyfile
```

Copy `deploy/ec2/deploy.sh` to the same folder as:

```txt
deploy.sh
```

Make it executable on EC2:

```bash
chmod +x deploy.sh
```

Create a server-only `.env` file from `deploy/ec2/env.example`.

For production HTTPS, set:

```txt
APP_DOMAIN=your-domain
ACME_EMAIL=your-email@example.com
CLIENT_URL=https://your-domain
COOKIE_SECURE=true
```

Before starting Caddy, create an `A` record in your DNS provider pointing the domain to the EC2 public IP or Elastic IP. Ports `80` and `443` must be open in the EC2 security group.

For local Redis inside Docker Compose, keep:

```txt
REDIS_CONNECTION_URL=
REDIS_USERNAME=default
REDIS_URL=redis
REDIS_PORT=6379
REDIS_TLS=false
REDIS_DB_PASSWORD=
```

For managed Redis, set the managed host, port, password, and TLS flag provided by the service:

```txt
REDIS_CONNECTION_URL=
REDIS_USERNAME=default
REDIS_URL=your-managed-redis-host
REDIS_PORT=your-managed-redis-port
REDIS_TLS=true-or-false
REDIS_DB_PASSWORD=your-managed-redis-password
```

If your provider gives a full Redis connection string, use `REDIS_CONNECTION_URL` instead:

```txt
REDIS_CONNECTION_URL=rediss://default:password@your-managed-redis-host:port
```

## Login To ECR

Run this on the EC2 instance:

```bash
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 813562480144.dkr.ecr.eu-north-1.amazonaws.com
```

The EC2 IAM role provides permission to pull private ECR images.

## Start PaperHunt

Recommended:

```bash
./deploy.sh
```

Manual equivalent:

```bash
docker compose --env-file .env config --quiet
docker compose --env-file .env pull
docker compose --env-file .env up -d --remove-orphans
docker compose ps
```

View logs:

```bash
docker compose logs -f backend-service
docker compose logs -f frontend
```

Open:

```txt
https://your-domain
```

## Update Deployment

When GitHub Actions publishes a new ECR image, update `IMAGE_TAG` in `.env`, then run:

```bash
./deploy.sh
```

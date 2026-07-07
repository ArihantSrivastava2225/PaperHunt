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
- `prometheus` scrapes backend, host, and container metrics.
- `grafana` visualizes Prometheus metrics and is bound to EC2 localhost only.
- `node-exporter` exposes EC2 host CPU, memory, disk, and network metrics.
- `cadvisor` exposes Docker container CPU, memory, and network metrics.
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

Do not expose Grafana port `3001` or Prometheus port `9090` publicly. They are bound to EC2 localhost and should be accessed through an SSH tunnel.

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

Copy the whole monitoring folder:

```txt
deploy/ec2/monitoring -> ~/paperhunt/monitoring
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

Set SES SMTP values for the contact form:

```txt
SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
MAIL_FROM=PaperHunt <contact@paperhunt.in>
CONTACT_RECEIVER_EMAIL=your-verified-receiver-email
```

`SMTP_USER` and `SMTP_PASS` are the SMTP credentials created from Amazon SES, not normal AWS access keys. While SES is in sandbox mode, `CONTACT_RECEIVER_EMAIL` must be verified in SES.

Set monitoring values:

```txt
PROMETHEUS_HOST_PORT=9090
PROMETHEUS_RETENTION_TIME=7d
PROMETHEUS_RETENTION_SIZE=1GB
GRAFANA_HOST_PORT=3001
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=use-a-strong-password
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
docker compose logs -f prometheus
docker compose logs -f grafana
```

Open:

```txt
https://your-domain
```

## Open Monitoring Dashboards

Grafana and Prometheus are intentionally not public. From your local machine, create an SSH tunnel:

```powershell
ssh -i .\paperhunt-ec2-key.pem -L 3001:localhost:3001 -L 9090:localhost:9090 ec2-user@your-ec2-public-ip
```

Then open:

```txt
Grafana:    http://localhost:3001
Prometheus: http://localhost:9090
```

Grafana credentials come from:

```txt
GRAFANA_ADMIN_USER
GRAFANA_ADMIN_PASSWORD
```

Prometheus is already provisioned as the default Grafana data source.

Useful Grafana starting points:

```txt
Explore -> Prometheus -> paperhunt_http_requests_total
Explore -> Prometheus -> paperhunt_http_request_duration_seconds_bucket
Explore -> Prometheus -> paperhunt_process_cpu_seconds_total
Explore -> Prometheus -> container_cpu_usage_seconds_total
Explore -> Prometheus -> node_memory_MemAvailable_bytes
```

## Update Deployment

When GitHub Actions publishes a new ECR image, update `IMAGE_TAG` in `.env`, then run:

```bash
./deploy.sh
```

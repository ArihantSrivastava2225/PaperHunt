#!/usr/bin/env sh
set -eu

AWS_REGION="${AWS_REGION:-eu-north-1}"

if [ ! -f ".env" ]; then
  echo "Missing .env file in $(pwd)"
  exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
  echo "Missing docker-compose.yml file in $(pwd)"
  exit 1
fi

ECR_REGISTRY="$(grep '^ECR_REGISTRY=' .env | cut -d '=' -f2-)"

if [ -z "$ECR_REGISTRY" ]; then
  echo "ECR_REGISTRY is required in .env"
  exit 1
fi

echo "Validating Docker Compose config..."
docker compose --env-file .env config --quiet

echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "Pulling images..."
docker compose --env-file .env pull

echo "Starting PaperHunt..."
docker compose --env-file .env up -d --remove-orphans

echo "Current service status:"
docker compose --env-file .env ps

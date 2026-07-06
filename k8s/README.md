# PaperHunt Kubernetes Deployment

This folder contains Kubernetes manifests for running PaperHunt locally on Docker Desktop Kubernetes.

## Architecture

- `frontend` serves the React build through Nginx.
- `frontend-service` exposes the app locally through NodePort `30080`.
- `backend` runs the Express API with two replicas.
- `backend-service` provides internal load balancing for backend pods.
- `mongo-service` provides internal access to MongoDB.
- `redis-service` provides internal access to Redis.
- MongoDB and Redis use PersistentVolumeClaims for local data persistence.
- Backend and frontend use readiness and liveness probes.
- Backend uses HPA to autoscale from 2 to 5 replicas based on CPU usage.

## Local vs Production

- `NodePort` is for local access. Production should use an Ingress or cloud LoadBalancer.
- `paperhunt-backend:latest` and `paperhunt-frontend:k8s` are local image names. Production images should be pushed to a registry such as AWS ECR.
- The MongoDB and Redis manifests are for local Kubernetes learning. Production should use managed services such as MongoDB Atlas and AWS ElastiCache or another managed Redis provider.
- `backend-secret.yaml` is intentionally ignored by Git. Commit the example secret under `k8s/examples/`, not real secret values.

## Prerequisites

- Docker Desktop running
- Kubernetes enabled in Docker Desktop
- `kubectl` configured with the `docker-desktop` context
- Local Docker images built:
  - `paperhunt-backend:latest`
  - `paperhunt-frontend:k8s`
- Metrics Server installed for HPA

## Build Images

From the project root:

```powershell
docker build -t paperhunt-backend:latest ./backend
docker build -t paperhunt-frontend:k8s ./frontend
```

## Local Secrets

Create a local secret file from the example:

```powershell
Copy-Item k8s/examples/backend-secret.example.yaml k8s/backend/backend-secret.yaml
```

Then fill `k8s/backend/backend-secret.yaml` with local development values. Do not commit that file.

## Metrics Server

Install Metrics Server:

```powershell
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Patch it for Docker Desktop Kubernetes:

```powershell
kubectl patch deployment metrics-server -n kube-system --type=strategic --patch-file k8s/metrics-server-patch.yaml
```

Verify metrics:

```powershell
kubectl top pods -n paperhunt
```

## Deploy

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongo/
kubectl apply -f k8s/redis/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

Or deploy everything with Kustomize:

```powershell
kubectl apply -f k8s/backend/backend-secret.yaml
kubectl apply -k k8s/
```

The Kustomize base intentionally does not include `backend-secret.yaml`, so real local secrets are not rendered into command output. Apply the secret file separately before applying the Kustomize base.

## AWS ECR Overlay

The base manifests use local Docker image names:

```txt
paperhunt-backend:latest
paperhunt-frontend:k8s
```

For AWS/ECR-style deployments, update these tags in `k8s/overlays/aws-ecr/kustomization.yaml` whenever the image publishing workflow creates a new commit SHA image:

```yaml
newTag: replace-with-backend-commit-sha
newTag: replace-with-frontend-commit-sha
```

Then render or apply the overlay:

```powershell
kubectl kustomize k8s/overlays/aws-ecr
kubectl apply -f k8s/backend/backend-secret.yaml
kubectl apply -k k8s/overlays/aws-ecr
```

The overlay keeps the same Kubernetes objects but replaces local image names with ECR image URLs.

Do not apply this overlay to Docker Desktop Kubernetes unless the cluster has credentials to pull from private ECR. On AWS EKS, ECR pull access is normally handled through the node role or pod identity permissions.

## Verify

```powershell
kubectl get pods -n paperhunt
kubectl get svc -n paperhunt
kubectl get pvc -n paperhunt
kubectl get hpa -n paperhunt
kubectl top pods -n paperhunt
```

Open the app:

```txt
http://localhost:30080
```

## Useful Commands

View backend logs:

```powershell
kubectl logs -n paperhunt -l app=backend --tail=100
```

Restart backend:

```powershell
kubectl rollout restart deployment/backend -n paperhunt
```

Check rollout:

```powershell
kubectl rollout status deployment/backend -n paperhunt
```

Scale backend manually:

```powershell
kubectl scale deployment/backend --replicas=2 -n paperhunt
```

Check autoscaling:

```powershell
kubectl get hpa -n paperhunt
```

## Cleanup

Delete the app resources:

```powershell
kubectl delete namespace paperhunt
```

This removes all PaperHunt Kubernetes resources in the namespace, including local PVCs.

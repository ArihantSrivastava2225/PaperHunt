# PaperHunt Monitoring

PaperHunt uses a small Prometheus and Grafana stack on the EC2 host.

## What Each Service Does

- `prometheus` collects time-series metrics.
- `grafana` displays metrics from Prometheus in dashboards.
- `node-exporter` exposes EC2 host metrics such as CPU, memory, disk, and network usage.
- `cadvisor` exposes Docker container metrics such as container CPU and memory usage.
- `backend-service` exposes app metrics at `/api/metrics`.

## Metrics Flow

```txt
Express backend /api/metrics
EC2 host metrics from node-exporter
Docker container metrics from cadvisor
        |
        v
Prometheus scrapes and stores metrics
        |
        v
Grafana queries Prometheus and displays dashboards
```

## Why Grafana Is Not Public

Grafana and Prometheus are bound to EC2 localhost:

```txt
127.0.0.1:3001 -> grafana:3000
127.0.0.1:9090 -> prometheus:9090
```

This means they are reachable from the EC2 machine, but not directly from the internet. Use an SSH tunnel:

```powershell
ssh -i .\paperhunt-ec2-key.pem -L 3001:localhost:3001 -L 9090:localhost:9090 ec2-user@your-ec2-public-ip
```

Then open:

```txt
http://localhost:3001
http://localhost:9090
```

## Backend Metrics

The backend exposes Prometheus-format metrics at:

```txt
/api/metrics
```

Caddy blocks this route publicly with:

```txt
respond /api/metrics 404
```

Prometheus still scrapes it inside the private Docker Compose network:

```txt
backend-service:5000/api/metrics
```

## Good First Grafana Queries

Total API traffic:

```promql
sum by (route, method, status_code) (rate(paperhunt_http_requests_total[5m]))
```

95th percentile API latency:

```promql
histogram_quantile(0.95, sum by (le, route) (rate(paperhunt_http_request_duration_seconds_bucket[5m])))
```

Container CPU usage:

```promql
sum by (name) (rate(container_cpu_usage_seconds_total[5m]))
```

Available EC2 memory:

```promql
node_memory_MemAvailable_bytes
```

## Resume Wording

```txt
Implemented production-style observability for a Dockerized MERN application on AWS EC2 using Prometheus, Grafana, node-exporter, and cAdvisor, with custom Express API metrics for request volume and latency.
```

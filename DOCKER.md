# Docker Deployment Guide

This guide explains how to build and run the Vulcan Academy frontend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

4. **Restart the container:**
   ```bash
   docker-compose restart
   ```

### Option 2: Using Docker directly

1. **Build the image:**
   ```bash
   docker build -t vulcan-academy-v2 .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name vulcan-academy-v2 \
     -p 3000:3000 \
     --restart unless-stopped \
     vulcan-academy-v2
   ```

3. **View logs:**
   ```bash
   docker logs -f vulcan-academy-v2
   ```

4. **Stop the container:**
   ```bash
   docker stop vulcan-academy-v2
   ```

5. **Remove the container:**
   ```bash
   docker rm vulcan-academy-v2
   ```

## Environment Variables

To set environment variables, you can either:

### Using Docker Compose

Edit `docker-compose.yml` and add environment variables:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=http://your-api-url
  - NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Using Docker Run

```bash
docker run -d \
  --name vulcan-academy-v2 \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  -e NODE_ENV=production \
  vulcan-academy-v2
```

## Production Deployment

### 1. Update API Endpoints

Before building, update the API base URL in `components/api/index.tsx` or use environment variables:

```javascript
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://your-api-url/api",
```

### 2. Build for Production

```bash
docker build -t vulcan-academy-v2:latest .
```

### 3. Tag for Registry (Optional)

```bash
docker tag vulcan-academy-v2:latest your-registry/vulcan-academy-v2:latest
```

### 4. Push to Registry (Optional)

```bash
docker push your-registry/vulcan-academy-v2:latest
```

## Health Check

The container includes a health check that verifies the application is running. Check status:

```bash
docker ps
```

The status column will show the health status.

## Troubleshooting

### Container won't start

1. Check logs:
   ```bash
   docker logs vulcan-academy-v2
   ```

2. Verify port 3000 is not in use:
   ```bash
   lsof -i :3000
   ```

3. Check container status:
   ```bash
   docker ps -a
   ```

### Build fails

1. Clear Docker cache:
   ```bash
   docker builder prune
   ```

2. Rebuild without cache:
   ```bash
   docker build --no-cache -t vulcan-academy-v2 .
   ```

### Image size optimization

The Dockerfile uses multi-stage builds to minimize the final image size. The production image only includes necessary runtime files.

## Accessing the Application

Once running, access the application at:
- Local: `http://localhost:3000`
- Production: `http://your-server-ip:3000`

## Reverse Proxy (Nginx Example)

For production, consider using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Notes

- The container runs as a non-root user (`nextjs`)
- Only necessary files are included in the production image
- Environment variables should be kept secure and not committed to version control

## Updating the Application

1. **Pull latest changes:**
   ```bash
   git pull
   ```

2. **Rebuild the image:**
   ```bash
   docker-compose up -d --build
   ```

   Or with Docker directly:
   ```bash
   docker build -t vulcan-academy-v2 .
   docker stop vulcan-academy-v2
   docker rm vulcan-academy-v2
   docker run -d --name vulcan-academy-v2 -p 3000:3000 vulcan-academy-v2
   ```


# Feud WebSocket Server - Docker Deployment

This directory contains the WebSocket server for the Feud game, configured for Docker deployment.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/praxisFeudExe
PORT=8080
NODE_ENV=production
```

### 2. Build and Run with Docker Compose

```bash
# Build and start the server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

### 3. Build and Run with Docker (without Compose)

```bash
# Build the image
docker build -t feud-websocket-server .

# Run the container
docker run -d \
  -p 8080:8080 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e PORT=8080 \
  --name feud-websocket-server \
  feud-websocket-server
```

## Development

For development with hot-reload:

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Uses hardcoded URI if not set |
| `PORT` | WebSocket server port | 8080 |
| `NODE_ENV` | Node environment | production |

## Accessing the Server

- **Local**: `ws://localhost:8080`
- **Network**: `ws://<your-ip-address>:8080`

## Health Check

The Docker container includes a health check that runs every 30 seconds to ensure the server is responsive.

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs websocket-server
```

### Can't connect to MongoDB

Verify your `MONGODB_URI` in the `.env` file and ensure your MongoDB instance allows connections from Docker containers.

### Port conflicts

If port 8080 is already in use, change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:8080"  # Maps host port 3001 to container port 8080
```

## Production Deployment

For production deployment:

1. Use a production-grade MongoDB instance
2. Set proper environment variables
3. Configure firewall rules for port 8080
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Set up monitoring and logging

## Useful Commands

```bash
# Rebuild the image
docker-compose build

# Restart the server
docker-compose restart

# View container status
docker-compose ps

# Remove all containers and volumes
docker-compose down -v

# View real-time logs
docker-compose logs -f websocket-server
```

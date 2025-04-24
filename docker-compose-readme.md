# Docker Compose Setup for Multilingual Chat Frontend

This document provides instructions for running the frontend component of the Multilingual Chat application using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system

## Running the Frontend Application

1. Navigate to the frontend directory:

```bash
cd path/to/Technical_Test/front
```

2. Start the frontend service:

```bash
docker-compose up -d
```

This will start the Next.js frontend service accessible at http://localhost:3001

3. To view logs:

```bash
docker-compose logs -f
```

## Stopping the Application

To stop the frontend service:

```bash
docker-compose down
```

## Service Details

### Frontend
- Port: 3001
- Technology: Next.js
- Features: Multilingual UI, user authentication, chat interface
- Connects to backend API at: http://148.113.181.101:8000

## Troubleshooting

If you encounter issues:

1. Check if the container is running:
```bash
docker-compose ps
```

2. Inspect container logs for errors:
```bash
docker-compose logs -f
```

3. Ensure the backend API is accessible at http://148.113.181.101:8000
```bash
curl http://148.113.181.101:8000/api/health/
```

4. If you need to modify the backend API URL, update the `NEXT_PUBLIC_API_URL` environment variable in the docker-compose.yml file.

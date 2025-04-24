#!/bin/bash

# These commands should be run on your VPS (148.113.181.101)

# Stop any running containers
docker compose down || docker stop multilingual-chat-frontend

# Pull the latest changes
git pull

# Start using the development configuration
docker compose -f docker-compose.dev.yml up -d

# Check if containers are running
docker ps

# View logs if needed
# docker compose -f docker-compose.dev.yml logs -f

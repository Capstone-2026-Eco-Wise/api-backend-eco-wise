# Docker Setup Guide

## Running the Application

To run the entire application stack (API + Redis), use Docker Compose:

```bash
docker compose up
```

This command will:
1. Build the API image from the Dockerfile
2. Pull the Redis image
3. Create the `eco_wise_network` network
4. Create the `redis_data` volume
5. Start both containers and connect them to the same network

### Access Points
- **API**: http://localhost:3000
- **Redis**: localhost:6379

## Environment Configuration

Before running, create a `.env` file in the project root with the required environment variables. You can use `.env.example` as a template:

```bash
cp .env.example .env
```

Then fill in the values:
- `PORT` - API port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `REDIS_URL` - Redis connection URL (automatically set to `redis://redis:6379/0` in compose)
- `DATABASE_URL` - Supabase/PostgreSQL connection
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `AI_API_URL` - AI service endpoint
- `ORIGIN_ALLOWED` - CORS origin

## Viewing Logs

To see real-time logs from all containers:

```bash
docker compose up
```

Or if running in detached mode (`-d`):

```bash
docker compose logs -f
```

To see logs from a specific service:

```bash
docker compose logs -f api
docker compose logs -f redis
```

## Stopping the Application

To stop all containers:

```bash
docker compose down
```

To stop and remove volumes:

```bash
docker compose down -v
```

## Rebuilding

If you make changes to the code or dependencies, rebuild the API image:

```bash
docker compose up --build
```

## Container Architecture

- **API Service** (`eco_wise_api`)
  - Built from local Dockerfile
  - Exposes port 3000
  - Connects to Redis via service name `redis`
  - Auto-restarts on failure
  - Volume mount: `./src:/app/src` for hot reload during development

- **Redis Service** (`eco_wise_redis`)
  - Image: `redis:latest`
  - Exposes port 6379
  - Memory limit: 256MB (reservation: 128MB)
  - CPU limit: 0.5 cores
  - Max memory policy: `allkeys-lru` (removes least recently used keys)
  - Auto-restarts on failure
  - Persistent volume: `redis_data`

## Network

Both services communicate via a custom bridge network `eco_wise_network`, allowing them to resolve each other by service name (e.g., `redis` hostname in the API).

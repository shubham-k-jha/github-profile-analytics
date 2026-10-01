# GitHub Profile Analytics

A production-clean, serverless GitHub portfolio analytics dashboard for `shubham-k-jha`.

## What's in this repo

- Uses current Upstash environment-variable names first:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Also supports Vercel's Upstash integration aliases:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
- Atomic Redis pipeline for profile counter increments
- Redis cache for GitHub API data (5 minutes)
- GitHub API rate-limit friendly
- Dedicated `/api/health` endpoint
- Input validation
- Server-side GitHub token only
- No client-side secrets
- Responsive dashboard
- Profile badge remains compatible
- Repository metrics and recent public activity
- Graceful errors
- Security headers
- Vercel cache headers

## Architecture

GitHub README → `/api/count` → Upstash Redis

Dashboard → `/api/github` → Redis cache → GitHub REST API

Dashboard → `/api/stats` → Upstash Redis

## Deployment

### 1. GitHub

Create a repository and upload the contents of this folder.

### 2. Vercel

Import the repository into Vercel. No framework configuration is required.

### 3. Upstash

Use the Vercel Upstash integration and create/link a Redis database.

The preferred environment variables are:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Vercel's Upstash integration may also provide:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
```

V4 supports both.

### 4. GitHub token

Create a fine-grained personal access token with only the minimum read access needed for your intended public-data usage. Store it only as a Vercel environment variable:

```text
GITHUB_TOKEN
```

Do not put it in GitHub README, JavaScript, HTML, or `.env` committed to the repository.

### 5. Redeploy

After adding/changing environment variables, redeploy the Vercel project.

### 6. Test

Health:

```text
https://YOUR-DOMAIN.vercel.app/api/health
```

Profile badge:

```text
https://YOUR-DOMAIN.vercel.app/api/count?username=shubham-k-jha
```

Counter JSON:

```text
https://YOUR-DOMAIN.vercel.app/api/stats?username=shubham-k-jha
```

GitHub data:

```text
https://YOUR-DOMAIN.vercel.app/api/github?username=shubham-k-jha
```

Dashboard:

```text
https://YOUR-DOMAIN.vercel.app/dashboard.html
```

## Profile README

```md
<p align="left">
  <img src="https://YOUR-DOMAIN.vercel.app/api/count?username=shubham-k-jha&label=PROFILE%20VIEWS" alt="GitHub Profile Views">
</p>
```

## Important analytics limitation

The visitor number is a badge-request counter. GitHub's README image proxy means it cannot reliably establish unique human visitors. Treat it as profile/badge hits, not audited unique-user analytics.

GitHub API repository/activity data is separate from this custom visitor counter.

## API design

- `GET /api/count` — increment profile counter and return SVG badge
- `GET /api/stats` — return total/month/day profile counts
- `GET /api/github` — return cached GitHub profile/repository/activity data
- `GET /api/health` — configuration/health check

## Cost-conscious design

GitHub data is cached for 5 minutes so dashboard refreshes do not repeatedly consume GitHub API quota. Authenticated GitHub REST API requests have a higher primary rate limit than unauthenticated requests. The visitor counter uses one Redis pipeline rather than three separate round trips for each badge hit.

For a personal portfolio, keep the deployment on the free tiers where available and monitor provider usage before scaling.

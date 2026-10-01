import { github } from "../lib/github.js";
import { redis, redisConfigured } from "../lib/redis.js";
import { json, validUsername } from "../lib/security.js";

const TTL = 300; // 5 minutes

async function cached(key, loader) {
  if (redisConfigured()) {
    try {
      const hit = await redis("GET", key);
      if (hit.result) return { data: JSON.parse(hit.result), cached: true };
    } catch {}
  }

  const fresh = await loader();

  if (redisConfigured()) {
    try { await redis("SET", key, JSON.stringify(fresh.data), "EX", TTL); } catch {}
  }
  return { data: fresh.data, cached: false, remaining: fresh.remaining };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const username = String(req.query.username || "shubham-k-jha");
  if (!validUsername(username)) return json(res, 400, { error: "Invalid username" });

  try {
    const result = await cached(`gpa:v4:github:${username}`, async () => {
      const [user, repos, events] = await Promise.all([
        github(`/users/${username}`),
        github(`/users/${username}/repos?per_page=100&sort=updated&direction=desc`),
        github(`/users/${username}/events/public?per_page=100`)
      ]);

      const publicRepos = repos.data.filter(r => !r.fork);
      const repositories = publicRepos.map(r => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        issues: r.open_issues_count,
        watchers: r.watchers_count,
        size: r.size,
        updated: r.updated_at,
        pushed: r.pushed_at,
        topics: r.topics || [],
        archived: r.archived
      })).sort((a,b) => (b.stars-a.stars) || (b.forks-a.forks));

      const stars = repositories.reduce((n,r) => n + r.stars, 0);
      const forks = repositories.reduce((n,r) => n + r.forks, 0);
      const issues = repositories.reduce((n,r) => n + r.issues, 0);
      const languages = {};
      repositories.forEach(r => { if (r.language) languages[r.language] = (languages[r.language] || 0) + 1; });

      return {
        data: {
          profile: {
            login: user.data.login, name: user.data.name, avatar: user.data.avatar_url,
            bio: user.data.bio, url: user.data.html_url, public_repos: user.data.public_repos,
            followers: user.data.followers, following: user.data.following,
            created_at: user.data.created_at
          },
          summary: { repositories: repositories.length, stars, forks, open_issues: issues },
          languages,
          repositories,
          activity: events.data.map(e => ({
            type: e.type, repo: e.repo?.name || null, created_at: e.created_at
          }))
        },
        remaining: Math.min(user.remaining ?? 9999, repos.remaining ?? 9999, events.remaining ?? 9999)
      };
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("X-Data-Source", result.cached ? "redis-cache" : "github-api");
    return res.status(200).json(result.data);
  } catch (e) {
    console.error(e);
    return json(res, e.status === 404 ? 404 : 502, {
      error: "GitHub data request failed",
      message: e.status === 404 ? "GitHub user not found" : "Try again shortly"
    });
  }
}

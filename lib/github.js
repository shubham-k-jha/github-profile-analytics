const API = "https://api.github.com";
const API_VERSION = "2026-03-10";

function headers() {
  const h = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "github-profile-analytics-v4"
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function github(path) {
  const r = await fetch(`${API}${path}`, {
    headers: headers(),
    signal: AbortSignal.timeout(8000)
  });

  const remaining = r.headers.get("x-ratelimit-remaining");
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    const err = new Error(`GitHub ${r.status}: ${body.slice(0, 240)}`);
    err.status = r.status;
    throw err;
  }
  return { data: await r.json(), remaining: remaining ? Number(remaining) : null };
}

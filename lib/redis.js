function env(name) {
  return process.env[name] || "";
}

// Supports both current Upstash names and Vercel's Upstash integration names.
const URL = env("UPSTASH_REDIS_REST_URL") || env("KV_REST_API_URL");
const TOKEN = env("UPSTASH_REDIS_REST_TOKEN") || env("KV_REST_API_TOKEN");

export function redisConfigured() {
  return Boolean(URL && TOKEN);
}

export async function redis(command, ...args) {
  if (!redisConfigured()) throw new Error("Redis is not configured");

  // Upstash REST supports command + arguments as URL path segments.
  const encoded = [command, ...args].map(v => encodeURIComponent(String(v))).join("/");
  const response = await fetch(`${URL}/${encoded}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Redis ${response.status}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

export async function pipeline(commands) {
  if (!redisConfigured()) throw new Error("Redis is not configured");
  const response = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  });
  if (!response.ok) throw new Error(`Redis pipeline ${response.status}`);
  return response.json();
}

import { redis, redisConfigured } from "../lib/redis.js";
import { json, validUsername } from "../lib/security.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const username = String(req.query.username || "shubham-k-jha");
  if (!validUsername(username)) return json(res, 400, { error: "Invalid username" });
  if (!redisConfigured()) return json(res, 503, { error: "Counter storage is not configured" });

  try {
    const now = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const base = `gpa:v4:${username}`;
    const total = await redis("GET", `${base}:total`);
    const month = now.toISOString().slice(0, 7);
    const currentMonth = await redis("GET", `${base}:month:${month}`);
    const daily = {};

    // Small dashboard dataset; 30 reads is acceptable for a personal project.
    for (const date of dates) {
      const value = await redis("GET", `${base}:day:${date}`);
      daily[date] = Number(value.result || 0);
    }

    return json(res, 200, {
      username,
      total: Number(total.result || 0),
      current_month: Number(currentMonth.result || 0),
      daily
    });
  } catch (e) {
    console.error(e);
    return json(res, 502, { error: "Counter storage error" });
  }
}

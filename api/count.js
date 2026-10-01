import { pipeline, redis, redisConfigured } from "../lib/redis.js";
import { validUsername } from "../lib/security.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function badge(count, label) {
  const value = Number(count || 0).toLocaleString("en-US");
  const left = Math.max(112, label.length * 7 + 22);
  const right = Math.max(62, value.length * 9 + 20);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${left + right}" height="28" role="img" aria-label="${esc(label)}: ${esc(value)}">
<title>${esc(label)}: ${esc(value)}</title>
<rect width="${left}" height="28" fill="#24292f"/><rect x="${left}" width="${right}" height="28" fill="#0969da"/>
<g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
<text x="${left/2}" y="18" text-anchor="middle">${esc(label)}</text>
<text x="${left + right/2}" y="18" text-anchor="middle">${esc(value)}</text>
</g></svg>`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const username = String(req.query.username || "shubham-k-jha");
  const label = String(req.query.label || "PROFILE VIEWS").slice(0, 24);
  if (!validUsername(username)) return res.status(400).send("Invalid username");
  if (!redisConfigured()) return res.status(503).send("Counter storage is not configured");

  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  const base = `gpa:v4:${username}`;
  const totalKey = `${base}:total`;

  try {
    // One atomic Redis pipeline: total + day + month.
    const result = await pipeline([
      ["INCR", totalKey],
      ["INCR", `${base}:day:${day}`],
      ["INCR", `${base}:month:${month}`]
    ]);

    const count = Array.isArray(result) ? result[0]?.result : null;
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(badge(count || 0, label));
  } catch (e) {
    console.error(e);
    return res.status(502).send("Counter storage error");
  }
}

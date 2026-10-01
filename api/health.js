import { redis, redisConfigured } from "../lib/redis.js";
import { json } from "../lib/security.js";

export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).end();
  let redisOk=false;
  if(redisConfigured()){
    try { await redis("PING"); redisOk=true; } catch {}
  }
  return json(res,200,{
    ok: redisOk,
    redis_configured: redisConfigured(),
    github_token_configured: Boolean(process.env.GITHUB_TOKEN),
    timestamp: new Date().toISOString()
  });
}

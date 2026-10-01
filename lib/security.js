export function validUsername(value) {
  return /^[A-Za-z0-9-]{1,39}$/.test(value);
}

export function validRepo(value) {
  return /^[A-Za-z0-9_.-]{1,100}$/.test(value);
}

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

export function json(res, status, body) {
  noStore(res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(body);
}

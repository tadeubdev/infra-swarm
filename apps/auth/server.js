import express from "express";
import { jwtVerify } from "jose";

const app = express();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "";
const AUTH_HEADER = process.env.AUTH_HEADER || "authorization";
const REQUIRED_AUD = process.env.REQUIRED_AUD || "";
const REQUIRED_ISS = process.env.REQUIRED_ISS || "";

if (!JWT_SECRET) {
  console.error("JWT_SECRET is required");
  process.exit(1);
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

function getBearerToken(req) {
  // padrão: Authorization: Bearer <token>
  const raw = req.headers[AUTH_HEADER]?.toString() || "";
  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : "";
}

app.get("/verify", async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).send("Missing Bearer token");

    const options = {};
    if (REQUIRED_AUD) options.audience = REQUIRED_AUD;
    if (REQUIRED_ISS) options.issuer = REQUIRED_ISS;

    const { payload } = await jwtVerify(token, secretKey, options);

    // headers para repassar pra API
    res.setHeader("X-Auth-Sub", String(payload.sub || ""));
    res.setHeader("X-Auth-Email", String(payload.email || ""));
    res.setHeader("X-Auth-Roles", Array.isArray(payload.roles) ? payload.roles.join(",") : String(payload.roles || ""));

    return res.status(200).send("OK");
  } catch (e) {
    return res.status(401).send("Invalid token");
  }
});

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => console.log(`auth-service listening on :${PORT}`));

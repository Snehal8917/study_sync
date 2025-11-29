import crypto from "crypto"

const SECRET = process.env.JWT_SECRET || "study-sync-secret-key-change-in-production"

interface JWTPayload {
  id: string
  email: string
  name: string
  iat?: number
  exp?: number
}

export function generateToken(payload: JWTPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")

  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60,
  }

  const body = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url")
  const signature = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url")

  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, body, signature] = token.split(".")
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url")

    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString())

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

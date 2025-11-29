import crypto from "crypto"

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
  return hashedPassword === hash
}

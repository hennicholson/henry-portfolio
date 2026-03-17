import { cookies } from "next/headers";
import { createHmac } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
}

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac("sha256", getSecret()).update(timestamp).digest("hex");
  return `${timestamp}.${hmac}`;
}

export function verifySessionToken(token: string): boolean {
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  const expected = createHmac("sha256", getSecret()).update(timestamp).digest("hex");
  if (signature !== expected) return false;

  // Check expiry
  const age = (Date.now() - parseInt(timestamp, 10)) / 1000;
  return age < SESSION_MAX_AGE;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;
  return verifySessionToken(session.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}

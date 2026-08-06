import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'demo-lab-secret-key-change-in-production-2026';
const key = new TextEncoder().encode(JWT_SECRET_KEY);

export const SESSION_COOKIE_NAME = 'session_token';
export const SESSION_DURATION_DAYS = 30;
export const SESSION_DURATION_SECONDS = SESSION_DURATION_DAYS * 24 * 60 * 60; // 30 días en segundos

export interface UserSessionPayload {
  id: string;
  username: string;
  nombre: string;
  rol: string;
}

/**
 * Genera un token JWT firmado para la sesión del usuario.
 */
export async function signSessionToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(key);
}

/**
 * Verifica y decodifica un token JWT de sesión.
 */
export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene la sesión actual desde las cookies en Server Components o API Routes.
 */
export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

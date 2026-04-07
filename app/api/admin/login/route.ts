import { NextResponse } from 'next/server';
import { verifyPassword, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }
    const { token, expires } = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}

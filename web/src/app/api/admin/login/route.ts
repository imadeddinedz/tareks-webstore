import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, error: 'Admin not configured' },
      { status: 500 }
    );
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('hts_admin', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}

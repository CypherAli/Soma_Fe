import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const raw = request.nextUrl.searchParams.get('path') ?? '/';
  const path = raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\') ? raw : '/';
  let destination = new URL(path, request.url);
  if (destination.origin !== request.nextUrl.origin) destination = new URL('/', request.url);
  const response = NextResponse.redirect(destination);
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Cache-Control', 'private, no-store');
  if (token && /^[a-f0-9]{64}$/.test(token)) response.cookies.set('soma-cms-preview', token, { httpOnly: true, sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', maxAge: 900, path: '/' });
  else response.cookies.delete('soma-cms-preview');
  return response;
}

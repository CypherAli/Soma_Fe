import { serverApiUrl } from '@/lib/serverApi';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{1,80}$/.test(id)) return new Response(null, { status: 404 });
  try {
    const upstream = await fetch(`${serverApiUrl()}/content/assets/${id}`, { signal: AbortSignal.timeout(30_000), redirect: 'error', cache: 'no-store' });
    if (!upstream.ok) return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
    const mime = upstream.headers.get('content-type')?.split(';')[0] ?? '';
    if (!['model/gltf-binary', 'image/png', 'image/jpeg', 'image/webp'].includes(mime)) return new Response(null, { status: 502 });
    return new Response(upstream.body, { headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return new Response(null, { status: 502 }); }
}

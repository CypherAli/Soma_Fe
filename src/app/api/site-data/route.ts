import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import type { NextRequest } from 'next/server';
import { getContent } from '@/lib/content/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '';
  if (!/^(?:\/kb\/[a-z0-9/_-]+\.json|\/human-atlas\/atlas\.json|\/atlas\/index\.json)$/.test(path)) return Response.json({ message: 'Tệp không được hỗ trợ' }, { status: 400 });
  const publicRoot = resolve(process.cwd(), 'public');
  const target = resolve(publicRoot, `.${path}`);
  if (!target.startsWith(publicRoot + sep)) return Response.json({ message: 'Đường dẫn không hợp lệ' }, { status: 400 });
  try {
    const [raw, content] = await Promise.all([readFile(target, 'utf8'), getContent()]);
    return Response.json(content.json(path, JSON.parse(raw)), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ message: 'Không đọc được dữ liệu' }, { status: 404 }); }
}

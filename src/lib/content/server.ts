import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { createContentResolver, EMPTY_CONTENT, type ContentSnapshot } from './resolve';
import { PublicationCache } from './publication-cache';
import contract from './contract.generated.json';
import { readFile, writeFile, mkdir, rename, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { serverApiUrl } from '../serverApi';

const api = serverApiUrl();
const publication = new PublicationCache(contract.contractHash);
const cacheDir = process.env.CMS_CACHE_DIR ?? resolve(process.cwd(), '.next/cache/site-content');
const cacheFile = resolve(cacheDir, `${createHash('sha256').update(`${api}:${contract.contractHash}`).digest('hex')}.json`);
async function fetchSnapshot(path: string) {
  const response = await fetch(`${api}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
  if (!response.ok) throw new Error(`Content API: ${response.status}`);
  return response.json() as Promise<ContentSnapshot>;
}
async function persist(snapshot: ContentSnapshot) {
  await mkdir(cacheDir, { recursive: true });
  const temporary = `${cacheFile}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, JSON.stringify(snapshot)); await rename(temporary, cacheFile); }
  finally { await unlink(temporary).catch(() => undefined); }
}
const published = () => publication.load(() => fetchSnapshot('/content/published'), async () => JSON.parse(await readFile(cacheFile, 'utf8')), persist, (error) => console.warn('[Soma CMS] Giữ bản công khai gần nhất:', error instanceof Error ? error.message : error));

export const loadContent = cache(async () => {
  const token = (await cookies()).get('soma-cms-preview')?.value;
  try {
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      const snapshot = await fetchSnapshot(`/content/preview/${token}`);
      if (!publication.accepts(snapshot)) throw new Error('Bản xem trước dùng hợp đồng CMS khác');
      return { snapshot, preview: true };
    }
    return { snapshot: await published(), preview: false };
  } catch (error) {
    console.error('[Soma CMS] Không tải được bản xem trước:', error instanceof Error ? error.message : error);
    return { snapshot: await published().catch(() => EMPTY_CONTENT), preview: false };
  }
});

export const getContent = cache(async () => createContentResolver((await loadContent()).snapshot));

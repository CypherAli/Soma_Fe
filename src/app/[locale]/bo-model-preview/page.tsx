import ModelAssetPreview from '@/components/content/ModelAssetPreview';

export const metadata = { title: 'Soma · Kiểm tra mô hình', robots: { index: false, follow: false } };

export default async function ModelPreviewPage({ searchParams }: { searchParams: Promise<{ model?: string }> }) {
  const { model = '' } = await searchParams;
  let allowed = /^\/models\/[a-zA-Z0-9_./% -]+\.glb$/.test(model) && !model.includes('..');
  let url = model;
  const publicApi = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
  if (/^\/api\/content\/assets\/[a-f0-9-]+$/.test(model)) { url = `${new URL(publicApi).origin}${model}`; allowed = true; }
  try {
    const asset = new URL(url);
    const api = new URL(publicApi);
    if (asset.origin === api.origin && /^\/api\/content\/assets\/[a-f0-9-]+$/.test(asset.pathname) && !asset.search && !asset.hash) allowed = true;
  } catch { }
  if (!allowed) return <p>Chỉ xem trước GLB trong thư viện Soma.</p>;
  return <ModelAssetPreview url={url} />;
}

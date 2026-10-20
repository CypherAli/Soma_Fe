import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ContentSurface } from '@/components/content/ContentProvider';
import './sources.css';
import '../../home.css';

function inline(text: string) {
  return text.split(/(https?:\/\/[^\s]+|`[^`]+`)/g).map((part,index)=>{
    if(part.startsWith('http'))return <a key={index} href={part} target="_blank" rel="noreferrer">{part}</a>;
    if(part.startsWith('`'))return <code key={index}>{part.slice(1,-1)}</code>;
    return part;
  });
}

export default async function SourcesPage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  setRequestLocale(locale);
  const source=await readFile(join(process.cwd(),'public/human-atlas/ATTRIBUTION.md'),'utf8');
  const blocks=source.trim().split(/\r?\n\s*\r?\n/);
  return <ContentSurface scope="src/app/[locale]/nguon-du-lieu/page.tsx"><main className="attribution-page">
    <Link href="/viewer">← {locale==='vi'?'Trở lại atlas':locale==='zh'?'返回图谱':'Back to atlas'}</Link>
    <h1>{locale==='vi'?'Nguồn và ghi công':locale==='zh'?'来源与署名':'Sources and attribution'}</h1>
    <p className="attribution-intro">{locale==='vi'?'Bản ghi công gốc của atlas BodyParts3D, gồm nguồn hình học, giấy phép, các thay đổi đã thực hiện và tài sản lịch sử.':locale==='zh'?'BodyParts3D 图谱的原始署名，包括几何来源、许可、改编记录和历史资源。':'The original BodyParts3D atlas attribution, including geometry sources, licensing, adaptations and historical assets.'}</p>
    <article lang="en">{blocks.map((block,index)=>{
      if(block.startsWith('# '))return <h2 key={index}>{block.slice(2)}</h2>;
      if(block.startsWith('## '))return <h2 key={index}>{block.slice(3)}</h2>;
      if(block.startsWith('- '))return <ul key={index}>{block.split(/\r?\n/).map((line,i)=><li key={i}>{inline(line.replace(/^- /,''))}</li>)}</ul>;
      return <p key={index}>{inline(block.replace(/\r?\n/g,' '))}</p>;
    })}</article>
    <a href="/human-atlas/ATTRIBUTION.md" download>{locale==='vi'?'Tải bản ghi công gốc (.md)':locale==='zh'?'下载原始署名文件 (.md)':'Download original attribution (.md)'}</a>
  </main></ContentSurface>;
}

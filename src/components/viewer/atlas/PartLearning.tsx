
"use client";
import { ContentSurface, useContent } from "@/components/content/ContentProvider";
import { partLearning } from '@/lib/humanAtlas/learning';
import { localizedPartName } from '@/lib/humanAtlas/partNames';
import { pick, type Loc } from '@/lib/homeContent';
import { Link } from '@/i18n/navigation';

export default function PartLearning({part,locale,showTopics=true,omitNote,hideIdentity=false}:{part:{id:string;name:string};locale:Loc;showTopics?:boolean;omitNote?:string;hideIdentity?:boolean}){
  const content=useContent();
  const info=partLearning(part.id,content);if(!info)return null;
  const text=(vi:string,en:string,zh:string)=>pick({vi,en,zh},locale);
  const note=info.note?.[locale];
  return <ContentSurface scope="src/components/viewer/atlas/PartLearning.tsx"><section className="anatomy-learning" aria-label={text('Thông tin cấu trúc','Structure information','结构信息')}>
    {!hideIdentity&&<h3>{localizedPartName(part,locale,content)}</h3>}
    {!hideIdentity&&info.latin&&<i>{info.latin}</i>}
    {note?note!==omitNote&&<p>{note}</p>:<p className="context-note">{text('Chưa có mô tả riêng đã biên tập cho mảnh này. Các mục dưới đây mô tả nhóm giải phẫu liên quan.','No individual description has been curated for this mesh. Related entries describe its anatomical group.','此网格尚无单独编写的描述。以下条目描述其相关解剖分组。')}</p>}
    <details><summary>{text('Tên và nguồn đối chiếu','Source name and references','源名称与参考资料')}</summary><p>{part.name} · {part.id}</p>{info.sources.map((source,index)=><p key={index}>{source.url?<Link href={source.url}>{source.title}</Link>:source.title}{source.page?` · ${text('trang PDF','PDF page','PDF页')} ${source.page}`:''}</p>)}</details>
    {showTopics&&info.topics.filter(topic=>topic.note[locale]!==note).slice(0,3).map(topic=><article key={`${topic.slug}/${topic.key}`}><h4>{pick(topic.name,locale)}</h4><p>{pick(topic.note,locale)}</p><Link href={`/giai-phau/mo-hinh/${topic.slug}?focus=${encodeURIComponent(topic.key)}`}>{text('Mở bài và cấu trúc liên quan','Open related lesson and structure','打开相关课程和结构')} ↗</Link></article>)}
  </section></ContentSurface>;
}

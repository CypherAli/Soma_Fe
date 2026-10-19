
import { getContent } from "@/lib/content/server";

import { bindContentSource } from "@/lib/content/source";

import { ContentSurface } from "@/components/content/ContentProvider";
import Image from "next/image";
import HomeNav from "./HomeNav";
import HomeFooter from "./HomeFooter";
import IconSprite from "./IconSprite";
import type { Loc } from "@/lib/homeContent";

const copy = bindContentSource("data:src/components/home/AnimalPage.tsx#copy", {
  vi: { eyebrow:"ANIMA · ANATOMIA VETERINARIA", title:"Atlas giải phẫu động vật nuôi", lead:"Không gian học giải phẫu so sánh dành cho sinh viên thú y và bác sĩ lâm sàng — từ cấu trúc xương đến các hệ cơ quan của từng loài.", explore:"Khám phá các loài", method:"Phương pháp dữ liệu", species:"Thư viện theo loài", speciesSub:"Mỗi atlas được tổ chức theo đặc điểm giải phẫu riêng của từng loài.", status:"ĐANG PHÁT TRIỂN", dog:"Chó", cat:"Mèo", horse:"Ngựa", poultry:"Gia cầm", dogLatin:"Canis familiaris", catLatin:"Felis catus", horseLatin:"Equus caballus", poultryLatin:"Gallus gallus domesticus", note:"Các mô hình thú y đang được chuẩn hóa trước khi phát hành.", scopeKicker:"PHẠM VI HỌC TẬP", scopeTitle:"Một cơ thể, nhiều góc nhìn lâm sàng", scopeBody:"Từ hình thái đại thể đến tương quan vị trí, nội dung được tổ chức để hỗ trợ nhận diện cấu trúc và đối chiếu giữa các loài.", scopes:[["01","Hệ xương","Mốc xương, khớp và đặc điểm vận động."],["02","Hệ cơ","Nhóm cơ, nguyên ủy, bám tận và chức năng."],["03","Nội tạng","Tiêu hóa, hô hấp, tiết niệu và sinh sản."],["04","Mạch & thần kinh","Đường đi mạch máu và chi phối thần kinh."]], compareKicker:"GIẢI PHẪU SO SÁNH", compareTitle:"Học sự khác biệt, hiểu điều bình thường", compareBody:"Cùng một cấu trúc được đặt cạnh nhau theo loài, vùng cơ thể và hệ cơ quan. Cách tiếp cận này giúp người học nhận ra biến thể hình thái trước khi đi vào chẩn đoán hình ảnh hoặc can thiệp.", comparePoints:["Đối chiếu cấu trúc tương đồng","Thuật ngữ thú y nhất quán","Nguồn dữ liệu được ghi rõ"], roadmap:"LỘ TRÌNH DỮ LIỆU", roadmapTitle:"Được xây dựng theo từng lớp", stages:[["01","Thu thập","Kiểm tra nguồn và giấy phép"],["02","Chuẩn hóa","Làm sạch mesh và thuật ngữ"],["03","Gắn nhãn","Liên kết cấu trúc lâm sàng"],["04","Phát hành","Mô hình tương tác trên web"]] },
  en: { eyebrow:"ANIMA · ANATOMIA VETERINARIA", title:"Domestic animal anatomy atlas", lead:"A comparative anatomy space for veterinary students and clinicians — from skeletal structures to the organ systems of each species.", explore:"Explore species", method:"Data methodology", species:"Browse by species", speciesSub:"Each atlas follows the distinct anatomical characteristics of its species.", status:"IN DEVELOPMENT", dog:"Dog", cat:"Cat", horse:"Horse", poultry:"Poultry", dogLatin:"Canis familiaris", catLatin:"Felis catus", horseLatin:"Equus caballus", poultryLatin:"Gallus gallus domesticus", note:"Veterinary models are being standardized before release." },
  zh: { eyebrow:"ANIMA · 兽医解剖学", title:"家养动物解剖图谱", lead:"面向兽医学生与临床医生的比较解剖空间——从骨骼结构到各物种器官系统。", explore:"探索物种", method:"数据方法", species:"按物种浏览", speciesSub:"每个图谱均按照相应物种的独特解剖特征组织。", status:"开发中", dog:"犬", cat:"猫", horse:"马", poultry:"家禽", dogLatin:"Canis familiaris", catLatin:"Felis catus", horseLatin:"Equus caballus", poultryLatin:"Gallus gallus domesticus", note:"兽医模型正在标准化，完成后发布。" },
});

export default async function AnimalPage({ locale }: { locale: Loc }) {
  const cmsContent = await getContent();
  const copy = cmsContent.resolve(cmsSourcecopy());

  const t=copy[locale]??copy.vi;
  const detail=copy.vi;
  const species=[{n:t.dog,l:t.dogLatin,no:"01"},{n:t.cat,l:t.catLatin,no:"02"},{n:t.horse,l:t.horseLatin,no:"03"},{n:t.poultry,l:t.poultryLatin,no:"04"}];
  return <ContentSurface scope="src/components/home/AnimalPage.tsx"><div className="bd animal-home"><IconSprite/><HomeNav minimal/>
    <header className="animal-hero">
      <div className="animal-hero-copy"><span>{t.eyebrow}</span><h1>{t.title}</h1><p>{t.lead}</p><div className="animal-actions"><a href="#species" className="pill pill-solid">{t.explore}</a></div></div>
      <div className="animal-hero-art"><Image src="/plates/skull-cat.jpg" alt="Minh họa giải phẫu sọ động vật" fill priority sizes="(max-width: 800px) 100vw, 48vw"/><div><span>FELIS CATUS</span><i/><span>CRANIUM · LATERALIS</span></div></div>
    </header>
    {locale==="vi"&&<section className="animal-scope"><div className="animal-section-head"><div><span>{detail.scopeKicker}</span><h2>{detail.scopeTitle}</h2></div><p>{detail.scopeBody}</p></div><div className="animal-scope-grid">{detail.scopes.map(([no,title,body])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>}
    <section className="animal-species" id="species"><div className="animal-section-head"><div><span>SPECIES INDEX</span><h2>{t.species}</h2></div><p>{t.speciesSub}</p></div><div className="animal-species-grid">{species.map(s=><article key={s.no}><span>{s.no}</span><div><h3>{s.n}</h3><em>{s.l}</em></div><b>{t.status}</b></article>)}</div><p className="animal-note">{t.note}</p></section>
    {locale==="vi"&&<><section className="animal-compare"><div><span>{detail.compareKicker}</span><h2>{detail.compareTitle}</h2></div><div><p>{detail.compareBody}</p><ul>{detail.comparePoints.map(x=><li key={x}>↗ {x}</li>)}</ul></div></section><section className="animal-roadmap"><div className="animal-section-head"><div><span>{detail.roadmap}</span><h2>{detail.roadmapTitle}</h2></div></div><div className="animal-roadmap-grid">{detail.stages.map(([no,title,body])=><article key={no}><b>{no}</b><h3>{title}</h3><p>{body}</p></article>)}</div></section></>}
    <HomeFooter locale={locale}/>
  </div></ContentSurface>;
}

function cmsSourcecopy() { return copy; }

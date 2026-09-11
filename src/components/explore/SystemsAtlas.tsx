import { Link } from "@/i18n/navigation";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import {
  regionGroups, scenesOfRegion, scenesOfSystem, systemGroups,
  type CatalogScene, type SystemGroupKey,
} from "@/lib/catalog";
import AtlasIcon from "./AtlasIcon";
import "./systems-atlas.css";

/**
 * Trang "Giải phẫu theo hệ" (/giai-phau/theo-he) và "Giải phẫu theo vùng"
 * (/giai-phau/theo-vung) — dựng theo lối atlas chuyên nghiệp. Bản cũ chỉ là một
 * lưới thẻ trộn lẫn, y hệt trang "Tất cả mô hình", không có lời giới thiệu nhóm
 * nào (user chê xấu, thiếu chuyên nghiệp; duyệt bản theo hệ rồi yêu cầu làm y
 * vậy cho theo vùng).
 *
 * Bố cục:
 *  1. Mục lục: mỗi nhóm một ô có ảnh đại diện, tên, tên tiếng Anh, số bài và
 *     một câu giới thiệu — bấm để nhảy tới khu của nhóm đó.
 *  2. Mỗi nhóm một khu: số thứ tự, tên, mô tả, dải bài học cuộn ngang, và lối
 *     "Xem tất cả" sang trang riêng của nhóm.
 * Dữ liệu dẫn xuất từ catalog nên thêm bài mới là tự có mặt đúng nhóm.
 */

type AtlasGroup = { key: string; slug: string; label: T3; icon: string; about: T3; cover?: string; scenes: CatalogScene[] };

/** Một câu giới thiệu mỗi hệ — viết cho sinh viên y. */
const SYSTEM_ABOUT: Record<SystemGroupKey, T3> = {
  skeletal: { vi: "206 xương làm khung nâng đỡ, bảo vệ tạng và làm đòn bẩy cho vận động; tuỷ xương tạo máu.", en: "206 bones form the frame that supports, protects the organs and acts as levers for movement; the marrow makes blood.", zh: "206块骨构成支架，支持并保护脏器，作为运动杠杆；骨髓造血。" },
  muscular: { vi: "Hơn 600 cơ vân kéo xương qua khớp; học theo khu, nguyên uỷ–bám tận và dây thần kinh chi phối.", en: "Over 600 skeletal muscles pull bones across joints; study them by compartment, attachments and nerve supply.", zh: "600多块骨骼肌牵拉骨跨越关节；按肌群、起止点和神经支配学习。" },
  nervous: { vi: "Não, tuỷ sống và dây thần kinh — trung tâm điều khiển, cảm giác và tư duy.", en: "Brain, spinal cord and nerves — the centre of control, sensation and thought.", zh: "脑、脊髓和神经——控制、感觉与思维的中枢。" },
  cardiovascular: { vi: "Tim và mạng mạch dài khoảng 100.000km đưa oxy, dưỡng chất tới từng tế bào.", en: "The heart and some 100,000km of vessels carrying oxygen and nutrients to every cell.", zh: "心脏与约10万公里的血管，将氧和营养送至每个细胞。" },
  digestive: { vi: "Ống tiêu hoá từ miệng tới hậu môn cùng gan, tuỵ, túi mật — tiêu hoá và hấp thu.", en: "The gut from mouth to anus with liver, pancreas and gallbladder — digestion and absorption.", zh: "从口到肛门的消化管及肝、胰、胆囊——消化与吸收。" },
  respiratory: { vi: "Từ mũi, hầu, thanh quản xuống cây phế quản — trao đổi khí và phát âm.", en: "From nose, pharynx and larynx down the bronchial tree — gas exchange and voice.", zh: "从鼻、咽、喉到支气管树——气体交换与发声。" },
  urinary: { vi: "Thận lọc khoảng 180 lít máu mỗi ngày; niệu quản, bàng quang, niệu đạo dẫn nước tiểu ra ngoài.", en: "The kidneys filter about 180 litres of blood a day; ureters, bladder and urethra carry urine out.", zh: "肾每日滤过约180升血液；输尿管、膀胱、尿道将尿液排出。" },
  endocrine: { vi: "Các tuyến đổ hormon thẳng vào máu, điều hoà chuyển hoá, tăng trưởng và sinh sản.", en: "Glands that release hormones straight into the blood, regulating metabolism, growth and reproduction.", zh: "直接向血液释放激素的腺体，调节代谢、生长与生殖。" },
  visual: { vi: "Nhãn cầu, cơ vận nhãn, bộ lệ và đường thị giác từ võng mạc tới vỏ não chẩm.", en: "The eyeball, eye muscles, lacrimal apparatus and the visual pathway from retina to occipital cortex.", zh: "眼球、眼外肌、泪器及从视网膜到枕叶皮质的视觉通路。" },
  auditory: { vi: "Tai ngoài, tai giữa và tai trong — nghe và giữ thăng bằng.", en: "The outer, middle and inner ear — hearing and balance.", zh: "外耳、中耳与内耳——听觉与平衡。" },
  reproductive: { vi: "Cơ quan sinh dục và tuyến phụ — sinh giao tử và hormon sinh dục.", en: "The reproductive organs and accessory glands — gametes and sex hormones.", zh: "生殖器官与附属腺——产生配子与性激素。" },
  fascia: { vi: "Mạc bọc cơ và tạng, chia khoang, truyền lực.", en: "Fascia wraps muscles and organs, divides compartments and transmits force.", zh: "筋膜包裹肌与脏器，分隔间隙并传递力量。" },
  connective: { vi: "Gân, dây chằng, màng — mô liên kết đặc giữ các cấu trúc lại với nhau.", en: "Tendons, ligaments and membranes — the dense connective tissue that binds structures together.", zh: "肌腱、韧带与膜——将各结构连在一起的致密结缔组织。" },
};

/** Một câu giới thiệu mỗi VÙNG — theo lối giải phẫu định khu. */
const REGION_ABOUT: Record<string, T3> = {
  "head-neck": { vi: "Sọ, não, giác quan, miệng–hầu–thanh quản và các tam giác cổ — vùng dày đặc cấu trúc nhất cơ thể.", en: "Skull, brain, special senses, mouth, pharynx, larynx and the neck triangles — the most densely packed region of the body.", zh: "颅骨、脑、感官、口咽喉及颈部三角——人体结构最密集的区域。" },
  thorax: { vi: "Lồng ngực bảo vệ tim, phổi và trung thất; cơ hoành ngăn cách với ổ bụng.", en: "The rib cage guarding the heart, lungs and mediastinum; the diaphragm separates it from the abdomen.", zh: "胸廓保护心、肺和纵隔；膈将其与腹腔分隔。" },
  abdomen: { vi: "Thành bụng, ống tiêu hoá, gan–tuỵ–lách, thận và khoang sau phúc mạc.", en: "The abdominal wall, gut, liver, pancreas and spleen, kidneys and the retroperitoneum.", zh: "腹壁、消化管、肝胰脾、肾及腹膜后间隙。" },
  back: { vi: "Cột sống từ cổ tới thắt lưng, đĩa đệm và các lớp cơ lưng nông, sâu.", en: "The spine from neck to lumbar region, the discs and the superficial and deep back muscles.", zh: "从颈到腰的脊柱、椎间盘及背部浅深层肌。" },
  "upper-limb": { vi: "Từ đai vai qua cánh tay, khuỷu, cẳng tay tới bàn tay — học theo khu cơ, khớp và mạch.", en: "From the shoulder girdle through arm, elbow and forearm to the hand — by compartment, joint and vessel.", zh: "从肩带经上臂、肘、前臂至手——按肌群、关节和血管学习。" },
  pelvis: { vi: "Vành chậu, đáy chậu và các tạng chậu: bàng quang, trực tràng, cơ quan sinh dục.", en: "The pelvic ring, pelvic floor and pelvic organs: bladder, rectum and reproductive organs.", zh: "骨盆环、盆底及盆腔脏器：膀胱、直肠、生殖器官。" },
  "lower-limb": { vi: "Từ hông qua đùi, gối, cẳng chân tới cổ chân–bàn chân — nâng đỡ và đi lại.", en: "From hip through thigh, knee and leg to ankle and foot — weight-bearing and walking.", zh: "从髋经大腿、膝、小腿至踝与足——承重与行走。" },
};

/** Bài đại diện làm ảnh bìa mục lục (ưu tiên bài bộ phận — hình gọn, dễ nhận). */
const COVER: Record<string, string> = {
  skeletal: "bo-phan-so", muscular: "bo-phan-dui", nervous: "bo-phan-nao", cardiovascular: "bo-phan-tim",
  digestive: "bo-phan-gan", respiratory: "bo-phan-phoi", urinary: "bo-phan-than", endocrine: "tuyen-giap",
  visual: "bo-phan-mat", reproductive: "he-sinh-san-nam",
  "head-neck": "bo-phan-so", thorax: "bo-phan-long-nguc", abdomen: "bo-phan-gan", back: "bo-phan-cot-song-that-lung",
  "upper-limb": "bo-phan-ban-tay", pelvis: "bo-phan-chau-hong", "lower-limb": "bo-phan-goi",
};

const TXT = {
  systems: { vi: "Mục lục hệ cơ quan", en: "Organ systems", zh: "器官系统目录" },
  regions: { vi: "Mục lục vùng cơ thể", en: "Body regions", zh: "身体区域目录" },
  lessons: { vi: "bài", en: "lessons", zh: "课" },
  viewAll: { vi: "Xem tất cả", en: "View all", zh: "查看全部" },
  jump: { vi: "Đến khu này", en: "Go to section", zh: "前往此部分" },
};

function GroupAtlas({ groups, heading, locale }: { groups: AtlasGroup[]; heading: T3; locale: Loc }) {
  return (
    <div className="sys-atlas">
      <section className="sys-index" aria-label={pick(heading, locale)}>
        <h2 className="sys-kicker">{pick(heading, locale)}</h2>
        <div className="sys-index-grid">
          {groups.map((g, i) => {
            const cover = g.scenes.find((s) => s.slug === g.cover)?.thumb ?? g.scenes.find((s) => s.thumb)?.thumb;
            return (
              <a key={g.key} href={`#${g.slug}`} className="sys-tile" aria-label={`${pick(g.label, locale)} — ${pick(TXT.jump, locale)}`}>
                <span className="sys-tile-media">
                  {cover ? <img src={cover} alt="" loading="lazy" /> : <AtlasIcon id={g.icon} className="atlas-icon sys-tile-icon" />}
                  <span className="sys-tile-no">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="sys-tile-body">
                  <span className="sys-tile-head">
                    <strong>{pick(g.label, locale)}</strong>
                    <em>{g.scenes.length}</em>
                  </span>
                  {locale !== "en" ? <small>{g.label.en}</small> : null}
                  <span className="sys-tile-about">{pick(g.about, locale)}</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {groups.map((g, i) => (
        <section key={g.key} id={g.slug} className="sys-section">
          <header className="sys-section-head">
            <span className="sys-section-no">{String(i + 1).padStart(2, "0")}</span>
            <div className="sys-section-title">
              <h2>
                <AtlasIcon id={g.icon} className="atlas-icon" />
                {pick(g.label, locale)}
                <span className="sys-count">{g.scenes.length} {pick(TXT.lessons, locale)}</span>
              </h2>
              <p>{pick(g.about, locale)}</p>
            </div>
            <Link href={`/giai-phau/${g.slug}`} className="sys-viewall">
              {pick(TXT.viewAll, locale)} <span aria-hidden>→</span>
            </Link>
          </header>
          <div className="sys-rail" data-lenis-prevent>
            {g.scenes.map((s) => (
              <Link key={s.slug} href={s.href} className="sys-card">
                <span className="sys-card-media">
                  {s.thumb ? <img src={s.thumb} alt="" loading="lazy" /> : <AtlasIcon id={g.icon} className="atlas-icon" />}
                </span>
                <span className="sys-card-title">{pick(s.title, locale)}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function SystemsAtlas({ locale }: { locale: Loc }) {
  const groups = systemGroups
    .map((g) => ({ ...g, about: SYSTEM_ABOUT[g.key], cover: COVER[g.key], scenes: scenesOfSystem(g.key) }))
    .filter((g) => g.scenes.length > 0);
  return <GroupAtlas groups={groups} heading={TXT.systems} locale={locale} />;
}

export function RegionsAtlas({ locale }: { locale: Loc }) {
  const groups = regionGroups
    .map((g) => ({
      ...g,
      about: REGION_ABOUT[g.key] ?? g.label,
      cover: COVER[g.key],
      scenes: scenesOfRegion(g.key),
    }))
    .filter((g) => g.scenes.length > 0);
  return <GroupAtlas groups={groups} heading={TXT.regions} locale={locale} />;
}

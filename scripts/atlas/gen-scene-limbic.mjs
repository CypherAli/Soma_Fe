/**
 * Sinh scene "Gian não, nhân nền và hệ viền" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-limbic.mjs
 *
 * Cấu trúc SÂU của não — cùng nguồn mảnh với scene đại não nhưng bỏ vỏ não,
 * chỉ giữ vỏ não thất bên làm mốc (mờ sẵn). Lọc bỏ mạch mang tên cấu trúc
 * (bẫy #10). Hạch nhân, thể vú, vùng dưới đồi có HAI mảnh = hai nửa, giữ cả.
 */
import { byRe, emit } from "./lib.mjs";

const N = (re) => byRe(re, ["nervous", "cardiac", "sensory", "endocrine"]);

emit({
  file: "limbic",
  exportName: "limbicScene",
  header: 'Scene "Gian não, nhân nền và hệ viền" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "gian-nao-he-vien",
    title: { vi: "Gian não, nhân nền và hệ viền", en: "Diencephalon, Basal Nuclei and Limbic System", zh: "间脑、基底核与边缘系统" },
    latin: "Diencephalon · Nuclei basales · Systema limbicum",
    intro: {
      vi: "Bóc hết vỏ não sẽ lộ ra ba hệ nằm sâu quanh não thất. Gian não (đồi thị, vùng dưới đồi) là trạm chuyển tiếp cảm giác và trung tâm điều hoà nội môi. Nhân nền (nhân đuôi, bèo sẫm, cầu nhạt) điều chỉnh vận động. Hệ viền (hải mã, hạnh nhân, vòm, thể vú, hồi đai) gắn trí nhớ với cảm xúc. Mỗi hệ một tông màu; não thất bên để mờ làm mốc.",
      en: "Strip away the cortex and three deep systems appear around the ventricles. The diencephalon (thalamus, hypothalamus) is the sensory relay and the centre of homeostasis. The basal nuclei (caudate, putamen, globus pallidus) tune movement. The limbic system (hippocampus, amygdala, fornix, mammillary bodies, cingulate gyrus) ties memory to emotion. Each system has its own colour family; the lateral ventricles are faded as a landmark.",
      zh: "剥去皮质后，脑室周围露出三个深部系统。间脑（丘脑、下丘脑）是感觉中继站和内环境稳态中枢。基底核（尾状核、壳核、苍白球）调节运动。边缘系统（海马、杏仁体、穹窿、乳头体、扣带回）将记忆与情绪联系起来。每个系统一种色系；侧脑室淡化作为标志。",
    },
  },
  faded: ["nao-that"],
  exclude: ["FJ1812"],
  groups: [
    {
      key: "doi-thi",
      tint: "#5f9e9a",
      latin: "Thalamus",
      name: { vi: "Đồi thị", en: "Thalamus", zh: "丘脑" },
      note: {
        vi: "Hai khối trứng hai bên não thất III. Mọi cảm giác trừ khứu giác dừng ở đây trước khi lên vỏ. Nhồi máu đồi thị gây mất cảm giác nửa người đối diện, đôi khi kèm đau dữ dội khó chữa (hội chứng Dejerine-Roussy).",
        en: "Two egg-shaped masses either side of the third ventricle. Every sensation except smell stops here before reaching the cortex. A thalamic infarct causes contralateral sensory loss, sometimes followed by severe intractable pain (Dejerine-Roussy syndrome).",
        zh: "位于第三脑室两侧的两个卵圆形团块。除嗅觉外所有感觉在抵达皮质前都在此换元。丘脑梗死导致对侧偏身感觉丧失，有时继发顽固性剧痛（Dejerine-Roussy综合征）。",
      },
      ids: N(/^(left|right) thalamus$/i),
    },
    {
      key: "tren-doi",
      tint: "#9fc6a0",
      latin: "Epithalamus",
      name: { vi: "Vùng trên đồi (tuyến tùng, cuống tuyến tùng)", en: "Epithalamus (pineal body, habenula)", zh: "上丘脑（松果体、缰）" },
      note: {
        vi: "Phần sau-trên của gian não: tuyến tùng tiết melatonin điều hoà nhịp ngày đêm; cuống tuyến tùng và vân tuỷ đồi thị nối hệ viền với thân não. Tuyến tùng hay vôi hoá ở người lớn — mốc đường giữa trên phim sọ. U vùng tuyến tùng đè mái trung não gây liệt nhìn lên (hội chứng Parinaud).",
        en: "The posterosuperior part of the diencephalon: the pineal body secretes melatonin to set the day-night rhythm; the habenula and stria medullaris link the limbic system to the brainstem. The pineal often calcifies in adults — a midline marker on skull films. A pineal-region tumour pressing on the tectum causes upgaze palsy (Parinaud syndrome).",
        zh: "间脑的后上部：松果体分泌褪黑素调节昼夜节律；缰和丘脑髓纹连接边缘系统与脑干。成人松果体常钙化——头颅平片上的中线标志。松果体区肿瘤压迫中脑顶盖可致上视麻痹（Parinaud综合征）。",
      },
      ids: N(/habenula$|stria medullaris of thalamus$|pineal body$/i),
    },
    {
      key: "the-goi",
      tint: "#6fb3a8",
      latin: "Corpora geniculata",
      name: { vi: "Thể gối ngoài và trong", en: "Lateral and medial geniculate bodies", zh: "外侧与内侧膝状体" },
      note: {
        vi: "Hai nhân chuyển tiếp chuyên biệt của đồi thị: thể gối NGOÀI cho thị giác (nhận dải thị, gửi tia thị lên thuỳ chẩm), thể gối TRONG cho thính giác (gửi lên hồi thái dương ngang). Mẹo nhớ: ngoài — nhìn (L-light), trong — nghe (M-music).",
        en: "Two specialised thalamic relay nuclei: the LATERAL geniculate for vision (receives the optic tract, sends the optic radiation to the occipital lobe), the MEDIAL for hearing (to the transverse temporal gyrus). Mnemonic: Lateral = Light, Medial = Music.",
        zh: "丘脑的两个特化中继核：外侧膝状体司视觉（接受视束，发出视辐射至枕叶），内侧膝状体司听觉（投射至颞横回）。记忆法：外侧=光（Light），内侧=音乐（Music）。",
      },
      ids: N(/geniculate body$/i),
    },
    {
      key: "duoi-doi",
      tint: "#e8a33d",
      latin: "Hypothalamus",
      name: { vi: "Vùng dưới đồi và tuyến yên", en: "Hypothalamus and pituitary", zh: "下丘脑与垂体" },
      note: {
        vi: "Nhỏ bằng hạt đậu nhưng điều khiển thân nhiệt, đói, khát, nhịp ngày đêm (nhân trên giao thoa) và toàn bộ hệ nội tiết qua tuyến yên treo bên dưới củ xám.",
        en: "The size of a pea yet in charge of body temperature, hunger, thirst, the day-night rhythm and the whole endocrine system via the pituitary, which hangs below on the tuber cinereum. The pineal body behind secretes melatonin.",
        zh: "仅豌豆大小，却掌控体温、饥饿、口渴、昼夜节律，并通过悬于灰结节下方的垂体调控整个内分泌系统。后方的松果体分泌褪黑素。",
      },
      ids: N(/hypothalamus$|tuber cinereum$|pituitary gland$|lamina terminalis$/i),
    },
    {
      key: "nhan-duoi",
      tint: "#8f78b3",
      latin: "Nucleus caudatus",
      name: { vi: "Nhân đuôi", en: "Caudate nucleus", zh: "尾状核" },
      note: {
        vi: "Hình chữ C ôm theo thành não thất bên, đầu to nhô vào sừng trán. Teo đầu nhân đuôi (sừng trán não thất phình ra trên phim) là dấu hiệu của bệnh Huntington — múa giật và sa sút trí tuệ.",
        en: "C-shaped, hugging the wall of the lateral ventricle, with a bulky head bulging into the frontal horn. Atrophy of the caudate head (a ballooned frontal horn on imaging) is the hallmark of Huntington's disease — chorea and dementia.",
        zh: "呈C形，沿侧脑室壁弯曲，头部膨大突入前角。尾状核头萎缩（影像上前角扩大）是亨廷顿病的标志——舞蹈症和痴呆。",
      },
      ids: N(/caudate nucleus$/i),
    },
    {
      key: "nhan-dau",
      tint: "#b58bc4",
      latin: "Putamen · Globus pallidus",
      name: { vi: "Nhân bèo sẫm và cầu nhạt", en: "Putamen and globus pallidus", zh: "壳核与苍白球" },
      note: {
        vi: "Hai nhân ghép thành nhân đậu (hình thấu kính), nằm ngoài bao trong. Bèo sẫm là nơi hay xuất huyết não do tăng huyết áp nhất (vỡ động mạch bèo vân). Cầu nhạt là cửa ra chính của nhân nền.",
        en: "Together they form the lens-shaped lentiform nucleus, lateral to the internal capsule. The putamen is the commonest site of hypertensive brain haemorrhage (ruptured lenticulostriate arteries). The globus pallidus is the main output of the basal nuclei.",
        zh: "二者合称豆状核（呈透镜形），位于内囊外侧。壳核是高血压脑出血最常见的部位（豆纹动脉破裂）。苍白球是基底核的主要输出核。",
      },
      ids: N(/putamen$|globus pallidus$/i),
    },
    {
      key: "bao-trong",
      tint: "#e3d3b0",
      latin: "Capsula interna",
      name: { vi: "Bao trong", en: "Internal capsule", zh: "内囊" },
      note: {
        vi: "Dải chất trắng hẹp hình chữ V (cắt ngang) kẹp giữa nhân đuôi, đồi thị (trong) và nhân đậu (ngoài). Mọi sợi vận động và cảm giác lên xuống vỏ não đều chen qua đây — một ổ nhồi máu nhỏ gây liệt nửa người đối diện hoàn toàn.",
        en: "A narrow V-shaped band of white matter (in cross-section) squeezed between the caudate and thalamus (medially) and the lentiform nucleus (laterally). Every motor and sensory fibre to and from the cortex crowds through here — a tiny infarct causes complete contralateral hemiplegia.",
        zh: "横断面呈V形的狭窄白质带，夹于内侧的尾状核、丘脑与外侧的豆状核之间。所有上下行的运动、感觉纤维均挤过此处——一个小梗死即可致对侧完全偏瘫。",
      },
      ids: N(/internal capsule$/i),
    },
    {
      key: "hai-ma",
      tint: "#d19aa3",
      latin: "Hippocampus · Gyrus parahippocampalis",
      name: { vi: "Hồi hải mã và hồi cạnh hải mã", en: "Hippocampus and parahippocampal gyrus", zh: "海马与海马旁回" },
      note: {
        vi: "Nằm ở sàn sừng thái dương não thất bên. Chuyển trí nhớ ngắn hạn thành dài hạn. Mất cả hai hải mã (ca H.M. nổi tiếng) thì không tạo được ký ức mới nào nữa; teo hải mã là dấu hiệu sớm của Alzheimer.",
        en: "Lies in the floor of the temporal horn of the lateral ventricle. It converts short-term into long-term memory. Losing both hippocampi (the famous patient H.M.) means no new memories can ever be formed; hippocampal atrophy is an early sign of Alzheimer's.",
        zh: "位于侧脑室下角底部，将短时记忆转化为长时记忆。双侧海马缺失（著名病例H.M.）将永远无法形成新记忆；海马萎缩是阿尔茨海默病的早期征象。",
      },
      ids: N(/hippocampus$|parahippocampal gyrus$/i),
    },
    {
      key: "hanh-nhan",
      tint: "#c05245",
      latin: "Corpus amygdaloideum",
      name: { vi: "Hạnh nhân", en: "Amygdala", zh: "杏仁体" },
      note: {
        vi: "Khối nhân hình quả hạnh ngay trước hải mã, gắn cảm xúc — nhất là sợ hãi — vào trải nghiệm và kích hoạt phản ứng \"chiến hay chạy\" qua vùng dưới đồi. Tổn thương hai bên làm mất cảm giác sợ (hội chứng Klüver-Bucy).",
        en: "An almond-shaped nuclear mass just in front of the hippocampus that attaches emotion — especially fear — to experience and triggers fight-or-flight through the hypothalamus. Bilateral damage abolishes fear (Klüver-Bucy syndrome).",
        zh: "位于海马前方的杏仁状核团，为经历赋予情绪（尤其是恐惧），并经下丘脑启动“战或逃”反应。双侧损伤导致恐惧消失（Klüver-Bucy综合征）。",
      },
      ids: N(/amygdala$/i),
    },
    {
      key: "vom-the-vu",
      tint: "#e07a6a",
      latin: "Fornix · Corpora mammillaria",
      name: { vi: "Vòm não, thể vú và vân tận cùng", en: "Fornix, mammillary bodies and stria terminalis", zh: "穹窿、乳头体与终纹" },
      note: {
        vi: "Vòm là bó sợi ra từ hải mã, cong qua trên đồi thị rồi xuống tận thể vú — một chặng của vòng Papez. Thiếu vitamin B1 ở người nghiện rượu làm thoái hoá thể vú, gây mất trí nhớ Korsakoff kèm bịa chuyện.",
        en: "The fornix is the fibre bundle leaving the hippocampus, arching over the thalamus down to the mammillary bodies — one leg of the Papez circuit. Thiamine deficiency in alcoholics degenerates the mammillary bodies, causing Korsakoff amnesia with confabulation.",
        zh: "穹窿是发自海马的纤维束，弓形越过丘脑上方下行至乳头体——Papez环路的一段。酗酒者维生素B1缺乏导致乳头体变性，引起Korsakoff遗忘症伴虚构。",
      },
      ids: N(/fornix of forebrain$|commissure of fornix|mammillary body$|stria terminalis$/i),
    },
    {
      key: "hoi-dai",
      tint: "#e8b3b8",
      latin: "Gyrus cinguli",
      name: { vi: "Hồi đai", en: "Cingulate gyrus", zh: "扣带回" },
      note: {
        vi: "Vòng quanh thể chai ở mặt trong bán cầu, khép kín vòng Papez. Tham gia chú ý, động lực và cảm nhận đau về mặt cảm xúc. Khối u chèn ép lớn đẩy hồi đai lách dưới liềm đại não (thoát vị dưới liềm).",
        en: "Curves around the corpus callosum on the medial surface, closing the Papez circuit. It is involved in attention, motivation and the emotional side of pain. A large mass can push it under the falx (subfalcine herniation).",
        zh: "环绕胼胝体位于半球内侧面，闭合Papez环路。参与注意、动机以及疼痛的情绪体验。大占位可将其推挤至大脑镰下（大脑镰下疝）。",
      },
      ids: N(/cingulate gyrus$/i),
    },
    {
      key: "nao-that",
      tint: "#6fb3d4",
      latin: "Ventriculi laterales · tertius",
      name: { vi: "Não thất (mốc)", en: "Ventricles (landmark)", zh: "脑室（标志）" },
      note: {
        vi: "Não thất bên và não thất III, làm mờ sẵn để định vị: nhân đuôi ôm thành ngoài não thất bên, đồi thị làm thành não thất III, hải mã nằm ở sàn sừng thái dương.",
        en: "The lateral and third ventricles, faded as a guide: the caudate hugs the lateral ventricle's outer wall, the thalamus forms the wall of the third ventricle, the hippocampus lies in the floor of the temporal horn.",
        zh: "侧脑室与第三脑室，淡化作为定位：尾状核贴附侧脑室外侧壁，丘脑构成第三脑室侧壁，海马位于下角底部。",
      },
      ids: N(/lateral ventricle$|^third ventricle$|interventricular foramen/i),
    },
  ],
});

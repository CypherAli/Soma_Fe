/**
 * Sinh scene "Giải phẫu Mắt" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-eye.mjs
 *
 * Chỉ lấy MẮT TRÁI: khảo sát cho thấy lưới mắt phải bị lẫn — giác mạc, củng
 * mạc, màng mạch, dây treo thể thuỷ tinh bên phải có hộp bao rộng 6,9–7,7cm
 * (một nhãn cầu chỉ ~2,5cm), tức mảnh phải chứa cả hình bên kia. Mắt trái
 * sạch (2,2–2,6cm).
 */
import { byRe, emit, P } from "./lib.mjs";

/** Lọc theo TÊN có chữ "left" — hộp bao x>0 không dùng được vì hai mắt sát đường giữa. */
const onlyLeft = (re) => byRe(re).filter((id) => /\bleft\b/i.test(P.find((p) => p.id === id).name));

emit({
  file: "eye",
  exportName: "eyeScene",
  header: 'Scene "Giải phẫu Mắt" (mắt trái) dựng từ bộ atlas BodyParts3D.\n\nLưới mắt phải bị lẫn nên chỉ dùng mắt trái.',
  scene: {
    slug: "giai-phau-mat",
    title: { vi: "Giải phẫu Mắt", en: "Anatomy of the Eye", zh: "眼解剖" },
    latin: "Bulbus oculi",
    intro: {
      vi: "Nhãn cầu có ba lớp vỏ: ngoài là củng mạc và giác mạc (xơ, bảo vệ), giữa là màng bồ đào gồm màng mạch, thể mi, mống mắt (mạch máu, điều tiết), trong là võng mạc (thần kinh). Bên trong chứa thuỷ dịch, thể thuỷ tinh và thể pha lê. Ánh sáng khúc xạ mạnh nhất ở giác mạc, được thể thuỷ tinh chỉnh tiêu cự rồi hội tụ lên võng mạc. Mỗi lớp một màu; bật mặt cắt để thấy các lớp lồng nhau.",
      en: "The eyeball has three coats: the outer fibrous coat of sclera and cornea (protection), the middle uvea of choroid, ciliary body and iris (blood supply, accommodation), and the inner retina (neural). Inside are the aqueous humour, lens and vitreous body. Light is bent most at the cornea, focused by the lens and brought to a point on the retina. Each layer has its own colour; turn on the cross-section to see them nested.",
      zh: "眼球壁分三层：外层为巩膜和角膜（纤维膜，起保护作用），中层为葡萄膜，包括脉络膜、睫状体和虹膜（供血、调节），内层为视网膜（神经层）。内容物有房水、晶状体和玻璃体。光线在角膜处折射最强，经晶状体调焦后聚焦于视网膜。各层以不同颜色显示；开启切面可见层层相套。",
    },
  },
  groups: [
    {
      key: "cung-mac",
      tint: "#ece6d6",
      latin: "Sclera",
      name: { vi: "Củng mạc", en: "Sclera", zh: "巩膜" },
      note: {
        vi: "\"Lòng trắng\" — lớp xơ dai chiếm 5/6 sau vỏ nhãn cầu, là chỗ bám của các cơ vận nhãn. Phía sau bị dây thị giác xuyên qua ở mảnh sàng — điểm yếu nơi đĩa thị lõm sâu trong glôcôm.",
        en: "The \"white of the eye\" — a tough fibrous coat forming the back five-sixths of the globe and anchoring the extraocular muscles. At the back it is pierced by the optic nerve at the lamina cribrosa — the weak point that cups deeply in glaucoma.",
        zh: "即“眼白”——坚韧的纤维膜，占眼球壁后5/6，为眼外肌附着处。后方视神经穿过巩膜筛板——青光眼时视盘凹陷加深的薄弱处。",
      },
      ids: onlyLeft(/sclera$/i),
    },
    {
      key: "giac-mac",
      tint: "#a8d4e6",
      latin: "Cornea",
      name: { vi: "Giác mạc và tiền phòng", en: "Cornea and anterior chamber", zh: "角膜与前房" },
      note: {
        vi: "Giác mạc trong suốt, không có mạch máu, đảm nhận khoảng 2/3 lực khúc xạ của mắt — nên phẫu thuật khúc xạ (LASIK) mài giác mạc chứ không động tới thể thuỷ tinh. Tiền phòng chứa thuỷ dịch, thoát ra ở góc tiền phòng; góc bị đóng gây glôcôm góc đóng cấp.",
        en: "The clear, avascular cornea provides about two-thirds of the eye's focusing power — which is why refractive surgery (LASIK) reshapes the cornea rather than the lens. The anterior chamber holds aqueous humour, which drains at the iridocorneal angle; if the angle closes, acute angle-closure glaucoma follows.",
        zh: "透明无血管的角膜提供眼约2/3的屈光力——故屈光手术（LASIK）重塑角膜而非晶状体。前房充满房水，经前房角引流；房角关闭引起急性闭角型青光眼。",
      },
      ids: onlyLeft(/cornea$|anterior chamber of left eyeball/i),
    },
    {
      key: "mong-mat",
      tint: "#7a9b5a",
      latin: "Iris",
      name: { vi: "Mống mắt", en: "Iris", zh: "虹膜" },
      note: {
        vi: "Màng có lỗ đồng tử ở giữa, điều chỉnh lượng sáng như màn chập máy ảnh: cơ vòng co đồng tử (phó giao cảm, dây III), cơ tia giãn đồng tử (giao cảm). Đồng tử co nhỏ một bên kèm sụp mi gợi ý hội chứng Horner.",
        en: "A diaphragm with the pupil at its centre, controlling how much light enters like a camera aperture: the sphincter constricts the pupil (parasympathetic, nerve III), the dilator widens it (sympathetic). A small pupil with a drooping lid on one side suggests Horner syndrome.",
        zh: "中央有瞳孔的隔膜，像相机光圈一样调节进光量：瞳孔括约肌缩瞳（副交感，动眼神经），瞳孔开大肌散瞳（交感）。单侧瞳孔缩小伴上睑下垂提示Horner综合征。",
      },
      ids: onlyLeft(/iris$/i),
    },
    {
      key: "the-mi",
      tint: "#b0708f",
      latin: "Corpus ciliare · Zonula ciliaris",
      name: { vi: "Thể mi và dây treo", en: "Ciliary body and zonule", zh: "睫状体与悬韧带" },
      note: {
        vi: "Cơ thể mi co làm dây treo CHÙNG lại (chứ không kéo căng), thể thuỷ tinh tự phồng lên để nhìn gần (điều tiết). Tuổi già thể thuỷ tinh cứng dần, không phồng được nữa — lão thị. Thể mi cũng tiết thuỷ dịch.",
        en: "Contraction of the ciliary muscle SLACKENS the zonular fibres, letting the lens round up for near vision (accommodation). With age the lens stiffens and can no longer round up — presbyopia. The ciliary body also secretes aqueous humour.",
        zh: "睫状肌收缩使悬韧带松弛，晶状体借自身弹性变凸以看近物（调节）。年老时晶状体变硬不再变凸——即老视。睫状体还分泌房水。",
      },
      ids: onlyLeft(/corona ciliaris$|suspensory ligament of left lens/i),
    },
    {
      key: "mang-mach",
      tint: "#7a3a4f",
      latin: "Choroidea",
      name: { vi: "Màng mạch", en: "Choroid", zh: "脉络膜" },
      note: {
        vi: "Lớp giàu mạch máu và sắc tố nằm giữa củng mạc và võng mạc, nuôi lớp tế bào cảm quang ngoài của võng mạc và hấp thụ ánh sáng tán xạ. Bong võng mạc tách võng mạc khỏi màng mạch — tế bào cảm quang mất nguồn nuôi và chết dần.",
        en: "A vascular, pigmented layer between the sclera and retina that feeds the outer photoreceptor layer and absorbs stray light. Retinal detachment separates the retina from the choroid — the photoreceptors lose their supply and die.",
        zh: "位于巩膜与视网膜之间、富含血管和色素的一层，营养视网膜外层感光细胞并吸收散射光。视网膜脱离使视网膜与脉络膜分开——感光细胞失去营养而逐渐死亡。",
      },
      ids: onlyLeft(/choroid$/i),
    },
    {
      key: "vong-mac",
      tint: "#e8883d",
      latin: "Retina",
      name: { vi: "Võng mạc", en: "Retina", zh: "视网膜" },
      note: {
        vi: "Lớp thần kinh chứa tế bào que (nhìn tối) và nón (màu, chi tiết). Hoàng điểm ở cực sau dày đặc tế bào nón — thị lực tinh nhất; đĩa thị (điểm mù) là chỗ sợi thần kinh rời nhãn cầu thành dây thị giác.",
        en: "The neural layer with rods (dim light) and cones (colour, detail). The macula at the posterior pole is packed with cones — the sharpest vision; the optic disc (blind spot) is where the nerve fibres leave the globe as the optic nerve.",
        zh: "神经层，含视杆细胞（暗视觉）和视锥细胞（色觉、精细视觉）。后极部黄斑视锥细胞密集——视力最敏锐；视盘（生理盲点）是神经纤维离开眼球形成视神经之处。",
      },
      ids: onlyLeft(/optic part of left retina/i),
    },
    {
      key: "thuy-tinh",
      tint: "#e8d98a",
      latin: "Lens · Corpus vitreum",
      name: { vi: "Thể thuỷ tinh và thể pha lê", en: "Lens and vitreous body", zh: "晶状体与玻璃体" },
      note: {
        vi: "Thể thuỷ tinh hai mặt lồi, trong suốt, treo sau mống mắt; đục thể thuỷ tinh là bệnh đục thuỷ tinh thể (cataract), mổ thay bằng thấu kính nhân tạo. Thể pha lê là khối gel chiếm 4/5 thể tích nhãn cầu, giữ võng mạc áp sát thành.",
        en: "The clear biconvex lens hangs behind the iris; its clouding is a cataract, treated by replacing it with an artificial lens. The vitreous is a gel filling four-fifths of the globe, holding the retina against the wall.",
        zh: "透明的双凸晶状体悬于虹膜后方；其混浊即白内障，手术以人工晶状体替换。玻璃体为凝胶，占眼球容积4/5，使视网膜贴附于眼球壁。",
      },
      ids: onlyLeft(/^left lens$|left vitreous body/i),
    },
    {
      key: "day-thi-giac",
      tint: "#d9c27a",
      latin: "N. opticus (II)",
      name: { vi: "Dây thần kinh thị giác (đoạn hốc mắt)", en: "Optic nerve (orbital part)", zh: "视神经（眶内段）" },
      note: {
        vi: "Thực chất là một bó chất trắng của não, được màng não bọc tới tận nhãn cầu — nên tăng áp lực nội sọ truyền theo bao màng gây phù đĩa thị, thấy được khi soi đáy mắt.",
        en: "Really a white-matter tract of the brain, sheathed by the meninges all the way to the globe — so raised intracranial pressure is transmitted along the sheath and causes papilloedema, visible on fundoscopy.",
        zh: "实为脑的白质纤维束，被脑膜包裹直至眼球——故颅内压增高沿鞘膜传导引起视盘水肿，眼底镜下可见。",
      },
      ids: byRe(/^left optic nerve$/i).filter((id) => id === "FJ1313"),
    },
  ],
});


import { bindContentSource } from "@/lib/content/source";
import type { SceneModule } from "./types";

/**
 * Hệ thính giác — 1 scene.
 *
 * GIỚI HẠN DỮ LIỆU (đã tìm kỹ trong Z-Anatomy, không phải bỏ sót): không có
 * mesh riêng cho ba ống bán khuyên, cơ bàn đạp, cơ căng màng nhĩ, ống tai
 * ngoài và vành tai dạng khối. Tiền đình có mặt nhưng là một khối chung chưa
 * tách ống bán khuyên. Những cấu trúc đó được nêu trong ghi chú thay vì dựng
 * hình phỏng đoán.
 */
export const auditoryScenes: Record<string, SceneModule> = bindContentSource("data:src/lib/scenes/auditory.ts#auditoryScenes", {
  "he-thinh-giac": {
    slug: "he-thinh-giac",
    title: {
      vi: "Hệ thính giác — đường dẫn truyền âm thanh",
      en: "Auditory System — Sound Conduction Pathway",
      zh: "听觉系统——声音传导通路",
    },
    description: {
      vi: "Chuỗi dẫn truyền âm thanh từ màng nhĩ qua ba xương con tai giữa (búa, đe, bàn đạp) tới tai trong. Âm thanh làm màng nhĩ rung, chuỗi xương con khuếch đại áp lực khoảng 20 lần nhờ chênh lệch diện tích giữa màng nhĩ và cửa sổ bầu dục cộng với hiệu ứng đòn bẩy, đủ để truyền rung động từ không khí sang dịch trong ốc tai. Mô hình thể hiện tai trái, kèm dây thần kinh tiền đình-ốc tai (dây sọ VIII) và thừng nhĩ đi xuyên qua hòm nhĩ.",
      en: "The sound conduction chain from the tympanic membrane through the three middle-ear ossicles (malleus, incus, stapes) to the inner ear. Sound vibrates the eardrum, and the ossicular chain amplifies pressure roughly twentyfold through the area difference between the tympanic membrane and the oval window plus a lever effect — enough to transfer vibration from air into the cochlear fluid. The model shows the left ear, together with the vestibulocochlear nerve (cranial nerve VIII) and the chorda tympani crossing the tympanic cavity.",
      zh: "声音自鼓膜经中耳三块听小骨（锤骨、砧骨、镫骨）传至内耳的传导链。声波使鼓膜振动，听小骨链借助鼓膜与卵圆窗的面积差及杠杆效应将压力放大约二十倍，足以把空气中的振动传入耳蜗液体。模型显示左耳，并含前庭蜗神经（第八对脑神经）与穿越鼓室的鼓索。",
    },
    visibleSystems: ["skeletal", "nervous"],
    modelFile: "/models/auditory_system.glb",
    hotspots: [
      {
        key: "tympanic-membrane",
        meshName: "Tympanic membrane.l",
        offset: [-150, -40],
        label: { vi: "Màng nhĩ", en: "Tympanic membrane", zh: "鼓膜" },
        latinName: "Membrana tympanica",
        note: {
          vi: "Màng mỏng hình nón ngăn ống tai ngoài với hòm nhĩ, đường kính khoảng 9-10 mm. Cán xương búa dính vào mặt trong màng nên rung động được truyền thẳng sang chuỗi xương con.",
          en: "A thin cone-shaped membrane separating the external acoustic meatus from the tympanic cavity, about 9-10 mm across. The handle of the malleus is embedded in its inner surface, so vibration passes directly to the ossicular chain.",
          zh: "分隔外耳道与鼓室的锥形薄膜，直径约9-10毫米。锤骨柄嵌于其内面，故振动可直接传至听小骨链。",
        },
      },
      {
        key: "malleus",
        meshName: "Malleus.l",
        offset: [140, -70],
        label: { vi: "Xương búa", en: "Malleus", zh: "锤骨" },
        latinName: "Malleus",
        note: {
          vi: "Xương con đầu tiên của chuỗi, cán gắn vào màng nhĩ còn đầu khớp với xương đe. Đây là một trong ba xương nhỏ nhất cơ thể người.",
          en: "The first ossicle in the chain: its handle attaches to the tympanic membrane while its head articulates with the incus. One of the three smallest bones in the human body.",
          zh: "听骨链的第一块：锤骨柄附于鼓膜，锤骨头与砧骨相关节。为人体最小的三块骨之一。",
        },
      },
      {
        key: "incus",
        meshName: "Incus.l",
        offset: [150, 10],
        label: { vi: "Xương đe", en: "Incus", zh: "砧骨" },
        latinName: "Incus",
        note: {
          vi: "Xương con ở giữa, nối xương búa với xương bàn đạp. Cùng với xương búa tạo thành hệ đòn bẩy làm tăng lực rung truyền vào tai trong.",
          en: "The middle ossicle, linking malleus to stapes. Together with the malleus it forms the lever system that increases the vibratory force delivered to the inner ear.",
          zh: "居中的听小骨，连接锤骨与镫骨。与锤骨共同构成杠杆系统，增大传入内耳的振动力。",
        },
      },
      {
        key: "stapes",
        meshName: "Stapes.l",
        offset: [130, 80],
        label: { vi: "Xương bàn đạp", en: "Stapes", zh: "镫骨" },
        latinName: "Stapes",
        note: {
          vi: "Xương nhỏ nhất trong cơ thể người (khoảng 3 mm). Đế xương bàn đạp lắp vào cửa sổ bầu dục, đẩy trực tiếp vào dịch ngoại bạch huyết của tai trong.",
          en: "The smallest bone in the human body (about 3 mm). Its footplate sits in the oval window and pushes directly on the perilymph of the inner ear.",
          zh: "人体最小的骨（约3毫米）。镫骨底嵌于卵圆窗，直接推动内耳外淋巴液。",
        },
      },
      {
        key: "cochlea",
        meshName: "Cochlea.l",
        offset: [-160, 90],
        label: { vi: "Ốc tai", en: "Cochlea", zh: "耳蜗" },
        latinName: "Cochlea",
        note: {
          vi: "Ống xoắn khoảng hai vòng rưỡi chứa cơ quan Corti — nơi tế bào lông chuyển rung động cơ học thành xung thần kinh. Tần số cao được cảm nhận ở nền ốc tai, tần số thấp ở đỉnh.",
          en: "A spiral canal of about two and a half turns housing the organ of Corti, where hair cells convert mechanical vibration into nerve impulses. High frequencies are detected at the base, low frequencies at the apex.",
          zh: "约两圈半的螺旋管道，内含Corti器，毛细胞在此将机械振动转换为神经冲动。高频在蜗底感受，低频在蜗顶感受。",
        },
      },
      {
        key: "vestibule",
        meshName: "Vestibule.l",
        offset: [-60, 130],
        label: { vi: "Tiền đình", en: "Vestibule", zh: "前庭" },
        latinName: "Vestibulum",
        note: {
          vi: "Khoang trung tâm của mê nhĩ xương, nằm giữa ốc tai và các ống bán khuyên, chứa soan nang và cầu nang cảm nhận gia tốc thẳng cùng trọng lực. Lưu ý: dữ liệu nguồn không tách riêng ba ống bán khuyên nên chúng không xuất hiện trong mô hình này.",
          en: "The central chamber of the bony labyrinth, lying between the cochlea and the semicircular canals; it contains the utricle and saccule, which sense linear acceleration and gravity. Note: the source dataset does not separate the three semicircular canals, so they are absent from this model.",
          zh: "骨迷路的中央腔，位于耳蜗与半规管之间，内含椭圆囊与球囊，感受线性加速度与重力。注意：源数据未单独分出三条半规管，故本模型中不含。",
        },
      },
      {
        key: "auditory-tube",
        meshName: "Auditory tube.l",
        offset: [40, 150],
        label: { vi: "Vòi tai (vòi Eustachi)", en: "Auditory tube (Eustachian tube)", zh: "咽鼓管" },
        latinName: "Tuba auditiva",
        note: {
          vi: "Ống nối hòm nhĩ với vòm họng, bình thường xẹp và chỉ mở khi nuốt hoặc ngáp để cân bằng áp suất hai bên màng nhĩ. Ở trẻ nhỏ vòi ngắn và nằm ngang hơn, đó là lý do viêm tai giữa hay gặp ở lứa tuổi này.",
          en: "The channel connecting the tympanic cavity to the nasopharynx. Normally collapsed, it opens on swallowing or yawning to equalise pressure across the eardrum. In young children it is shorter and more horizontal, which is why middle-ear infection is common at that age.",
          zh: "连接鼓室与鼻咽的管道，平时闭合，吞咽或打哈欠时开放以平衡鼓膜两侧压力。幼儿咽鼓管较短且更水平，故中耳炎在该年龄段常见。",
        },
      },
      {
        key: "vestibulocochlear-nerve",
        meshName: "Vestibulocochlear nerve (VIII).l",
        offset: [-170, 150],
        label: { vi: "Thần kinh tiền đình-ốc tai (VIII)", en: "Vestibulocochlear nerve (VIII)", zh: "前庭蜗神经（VIII）" },
        latinName: "Nervus vestibulocochlearis",
        note: {
          vi: "Dây thần kinh sọ số VIII, gồm phần ốc tai dẫn tín hiệu thính giác và phần tiền đình dẫn tín hiệu thăng bằng, cùng đi qua ống tai trong về thân não.",
          en: "Cranial nerve VIII, comprising a cochlear division carrying hearing signals and a vestibular division carrying balance signals; both traverse the internal acoustic meatus to the brainstem.",
          zh: "第八对脑神经，含传导听觉的蜗部与传导平衡觉的前庭部，共同经内耳道至脑干。",
        },
      },
      {
        key: "chorda-tympani",
        meshName: "Chorda tympani.l",
        offset: [170, 120],
        label: { vi: "Thừng nhĩ", en: "Chorda tympani", zh: "鼓索" },
        latinName: "Chorda tympani",
        note: {
          vi: "Nhánh của dây thần kinh mặt (VII) đi xuyên qua hòm nhĩ giữa xương búa và xương đe, mang cảm giác vị giác cho hai phần ba trước lưỡi. Vì đi sát chuỗi xương con nên nó có thể bị tổn thương trong phẫu thuật tai giữa.",
          en: "A branch of the facial nerve (VII) that crosses the tympanic cavity between malleus and incus, carrying taste from the anterior two-thirds of the tongue. Its close relation to the ossicles puts it at risk during middle-ear surgery.",
          zh: "面神经（VII）的分支，在锤骨与砧骨之间穿越鼓室，传导舌前三分之二的味觉。因紧邻听骨链，中耳手术时易受损伤。",
        },
      },
    ],
  },
});

/**
 * Sinh scene "Cơ Cánh tay" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-arm-muscles.mjs
 *
 * Cánh tay TRÁI. Lọc theo hệ `muscular` + `skeletal` vì atlas xếp vài cơ vào
 * `skeletal`. Chia theo KHOANG (trước — gấp, thần kinh cơ bì; sau — duỗi,
 * thần kinh quay), vì đó là cách học và cách chẩn đoán tổn thương thần kinh.
 */
import { byRe, emit, leftSide } from "./lib.mjs";

const M = (re) => leftSide(byRe(re, ["muscular", "skeletal"]));

emit({
  file: "arm-muscles",
  exportName: "armMusclesScene",
  header: 'Scene "Cơ Cánh tay" (bên trái) dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "co-canh-tay",
    title: { vi: "Cơ Cánh tay", en: "Muscles of the Arm", zh: "臂肌" },
    latin: "Musculi brachii",
    intro: {
      vi: "Vách gian cơ chia cánh tay thành hai khoang. Khoang TRƯỚC (nhị đầu, cánh tay, quạ-cánh tay) gấp khuỷu và vai, do thần kinh cơ bì chi phối. Khoang SAU (tam đầu, khuỷu) duỗi khuỷu, do thần kinh quay chi phối. Cơ cánh tay-quay nằm ở ranh giới, gấp khuỷu ở tư thế nửa sấp. Khoang trước tông đỏ, khoang sau tông xanh; xương cánh tay mờ sẵn làm mốc.",
      en: "Intermuscular septa divide the arm into two compartments. The ANTERIOR compartment (biceps, brachialis, coracobrachialis) flexes the elbow and shoulder and is supplied by the musculocutaneous nerve. The POSTERIOR compartment (triceps, anconeus) extends the elbow and is supplied by the radial nerve. Brachioradialis sits at the border and flexes the elbow in mid-pronation. Anterior in reds, posterior in blues; the humerus is faded as a landmark.",
      zh: "肌间隔将上臂分为两个骨筋膜室。前群（肱二头肌、肱肌、喙肱肌）屈肘屈肩，受肌皮神经支配。后群（肱三头肌、肘肌）伸肘，受桡神经支配。肱桡肌位于交界处，在半旋前位屈肘。前群红色系，后群蓝色系；肱骨淡化作为标志。",
    },
  },
  faded: ["xuong"],
  // Căn theo cơ, không theo xương vai + cẳng tay (mờ) làm khung phình gấp đôi.
  frame: ["nhi-dau", "canh-tay", "qua-canh-tay", "tam-dau", "khuyu", "canh-tay-quay"],
  groups: [
    {
      key: "nhi-dau",
      tint: "#c05245",
      latin: "M. biceps brachii",
      name: { vi: "Cơ nhị đầu cánh tay", en: "Biceps brachii", zh: "肱二头肌" },
      note: {
        vi: "Đầu dài bám củ trên ổ chảo (gân chạy trong rãnh gian củ, trong bao khớp vai), đầu ngắn bám mỏm quạ. Bám tận vào lồi củ xương quay nên vừa gấp khuỷu vừa là cơ NGỬA mạnh nhất (vặn tuốc-nơ-vít). Đứt gân đầu dài tạo dấu \"Popeye\" — bụng cơ tụt xuống.",
        en: "The long head arises from the supraglenoid tubercle (its tendon runs in the intertubercular groove, inside the shoulder capsule), the short head from the coracoid. It inserts on the radial tuberosity, so it both flexes the elbow and is the strongest SUPINATOR (driving a screwdriver). A ruptured long-head tendon gives the \"Popeye\" sign — the belly bunches down.",
        zh: "长头起自盂上结节（肌腱行于结节间沟、肩关节囊内），短头起自喙突。止于桡骨粗隆，故既屈肘又是最强的旋后肌（拧螺丝刀）。长头腱断裂出现“大力水手征”——肌腹下移隆起。",
      },
      ids: M(/biceps brachii$/i),
    },
    {
      key: "canh-tay",
      tint: "#d0685a",
      latin: "M. brachialis",
      name: { vi: "Cơ cánh tay", en: "Brachialis", zh: "肱肌" },
      note: {
        vi: "Nằm dưới cơ nhị đầu, bám mỏm vẹt xương trụ — là cơ gấp khuỷu \"thuần\" nhất, gấp ở mọi tư thế sấp ngửa. Sau chấn thương khuỷu có thể cốt hoá trong cơ (viêm cơ cốt hoá) làm cứng khớp.",
        en: "Lies beneath biceps and inserts on the coronoid process of the ulna — the \"pure\" elbow flexor, working in any forearm position. After elbow trauma it can ossify (myositis ossificans), stiffening the joint.",
        zh: "位于肱二头肌深面，止于尺骨冠突——是最“纯粹”的屈肘肌，前臂任何旋转位均可屈肘。肘部外伤后可发生肌内骨化（骨化性肌炎）导致关节僵硬。",
      },
      // \b: không thì /brachialis$/ bắt cả "coracoBRACHIALIS" và nhóm quạ-cánh tay rỗng.
      ids: M(/\bbrachialis$/i),
    },
    {
      key: "qua-canh-tay",
      tint: "#e07a6a",
      latin: "M. coracobrachialis",
      name: { vi: "Cơ quạ-cánh tay", en: "Coracobrachialis", zh: "喙肱肌" },
      note: {
        vi: "Từ mỏm quạ tới giữa thân xương cánh tay, gấp và khép vai. Thần kinh cơ bì xuyên qua bụng cơ này — mốc tìm dây thần kinh khi mổ.",
        en: "From the coracoid to the middle of the humeral shaft, flexing and adducting the shoulder. The musculocutaneous nerve pierces its belly — the landmark for finding the nerve at surgery.",
        zh: "自喙突至肱骨干中部，屈曲和内收肩关节。肌皮神经穿过此肌肌腹——手术中寻找该神经的标志。",
      },
      ids: M(/coracobrachialis$/i),
    },
    {
      key: "tam-dau",
      tint: "#527c9f",
      latin: "M. triceps brachii",
      name: { vi: "Cơ tam đầu cánh tay", en: "Triceps brachii", zh: "肱三头肌" },
      note: {
        vi: "Ba đầu: dài (củ dưới ổ chảo), ngoài và trong (thân xương cánh tay, hai bên rãnh thần kinh quay), cùng bám mỏm khuỷu — cơ duỗi khuỷu duy nhất có sức. Gãy giữa thân xương cánh tay làm tổn thương thần kinh quay trong rãnh xoắn nhưng thường chừa cơ tam đầu, vì các nhánh vào cơ đã tách phía trên.",
        en: "Three heads — long (infraglenoid tubercle), lateral and medial (humeral shaft, either side of the radial groove) — inserting together on the olecranon: the only powerful elbow extensor. A mid-shaft humeral fracture injures the radial nerve in the spiral groove but usually spares triceps, because its branches leave higher up.",
        zh: "三个头——长头（盂下结节）、外侧头和内侧头（肱骨干桡神经沟两侧）——共同止于鹰嘴，是唯一有力的伸肘肌。肱骨干中段骨折可伤及桡神经沟内的桡神经，但通常不累及肱三头肌，因其肌支在较高处已发出。",
      },
      ids: M(/triceps brachii$/i),
    },
    {
      key: "khuyu",
      tint: "#6f93b8",
      latin: "M. anconeus",
      name: { vi: "Cơ khuỷu", en: "Anconeus", zh: "肘肌" },
      note: {
        vi: "Cơ tam giác nhỏ sau khuỷu, hỗ trợ duỗi và giữ vững khớp khuỷu khi sấp tay.",
        en: "A small triangular muscle behind the elbow that assists extension and stabilises the joint during pronation.",
        zh: "肘后方的小三角形肌，协助伸肘并在旋前时稳定肘关节。",
      },
      ids: M(/anconeus$/i),
    },
    {
      key: "canh-tay-quay",
      tint: "#e8a33d",
      latin: "M. brachioradialis",
      name: { vi: "Cơ cánh tay-quay", en: "Brachioradialis", zh: "肱桡肌" },
      note: {
        vi: "Ngoại lệ: nằm ở phía trước, gấp khuỷu, nhưng do thần kinh QUAY chi phối (thuộc nhóm duỗi về nguồn gốc). Mạnh nhất khi cẳng tay ở tư thế nửa sấp — như cầm cốc bia.",
        en: "The exception: it lies in front and flexes the elbow, yet is supplied by the RADIAL nerve (it belongs to the extensor group by origin). Strongest with the forearm mid-prone — like holding a beer mug.",
        zh: "例外：位于前方、能屈肘，却由桡神经支配（按起源属伸肌群）。前臂处于半旋前位时力量最大——如握啤酒杯的姿势。",
      },
      ids: M(/brachioradialis$/i),
    },
    {
      key: "xuong",
      latin: "Humerus · Radius · Ulna · Scapula",
      name: { vi: "Xương (mốc)", en: "Bones (landmarks)", zh: "骨（标志）" },
      note: {
        vi: "Xương vai, cánh tay, quay, trụ — mờ sẵn để thấy nguyên uỷ và bám tận của từng cơ.",
        en: "Scapula, humerus, radius, ulna — faded so the origin and insertion of each muscle show through.",
        zh: "肩胛骨、肱骨、桡骨、尺骨——淡化以显示各肌的起止点。",
      },
      ids: leftSide(byRe(/scapula$|humerus$|radius$|ulna$/i, ["skeletal"])),
    },
  ],
});

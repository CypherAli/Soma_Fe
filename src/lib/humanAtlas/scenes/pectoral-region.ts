
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cơ vùng ngực" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Vùng ngực và tuyến vú" cũ: atlas không có tuyến vú và hạch nách.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const pectoralRegionScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/pectoral-region.ts#pectoralRegionScene", {
  "slug": "vung-nguc-tuyen-vu",
  "title": {
    "vi": "Cơ vùng ngực và mạch nuôi",
    "en": "Muscles of the Pectoral Region",
    "zh": "胸前区肌与血管"
  },
  "latin": "Regio pectoralis",
  "system": "muscular",
  "intro": {
    "vi": "Vùng ngực có bốn cơ nối chi trên với thành ngực. Cơ ngực lớn hình quạt, gồm phần đòn, phần ức–sườn và phần bụng. Cơ ngực bé nằm dưới nó, là mốc chia động mạch nách. Cơ dưới đòn nhỏ, nằm dưới xương đòn. Cơ răng trước ôm thành ngực bên. Tuyến vú (không có trong bộ dữ liệu) nằm trên mạc cơ ngực lớn; ung thư xâm lấn cơ này làm khối u dính, không di động được. Mạch nuôi chính là nhánh ngực của động mạch ngực–cùng vai và động mạch ngực ngoài. Mỗi cơ một màu; lồng ngực mờ sẵn.",
    "en": "The pectoral region has four muscles linking the upper limb to the chest wall. Pectoralis major is fan-shaped, with clavicular, sternocostal and abdominal parts. Pectoralis minor lies beneath it and marks the parts of the axillary artery. The small subclavius lies under the clavicle. Serratus anterior wraps the lateral chest wall. The breast (not in the dataset) sits on the fascia of pectoralis major; cancer invading the muscle makes the lump fixed. The main supply is the pectoral branch of the thoraco-acromial artery and the lateral thoracic artery. Each muscle has its own colour; the rib cage is faded.",
    "zh": "胸前区有四块连接上肢与胸壁的肌：胸大肌呈扇形，分锁骨部、胸肋部和腹部；胸小肌位于其深面，是腋动脉分段标志；锁骨下肌小，位于锁骨下方；前锯肌包绕胸外侧壁。乳腺（数据集中无）位于胸大肌筋膜上；乳腺癌侵及此肌时肿块固定不动。主要血供为胸肩峰动脉胸肌支和胸外侧动脉。每肌一种颜色；胸廓淡化。"
  },
  "frameGroups": [
    "nguc-lon",
    "nguc-be",
    "rang-truoc"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "nguc-lon",
      "name": {
        "vi": "Cơ ngực lớn (ba phần)",
        "en": "Pectoralis major (three parts)",
        "zh": "胸大肌（三部）"
      },
      "latin": "M. pectoralis major (partes clavicularis, sternocostalis, abdominalis)",
      "note": {
        "vi": "Khép và xoay trong cánh tay. Phần đòn gấp vai; phần ức–sườn duỗi cánh tay đang gấp. Bờ dưới tạo nếp nách trước.",
        "en": "Adducts and medially rotates the arm. The clavicular part flexes the shoulder; the sternocostal part extends the flexed arm. Its lower edge forms the anterior axillary fold.",
        "zh": "内收并内旋上臂。锁骨部屈肩；胸肋部使已屈的上臂伸展。下缘构成腋前襞。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1446",
        "FJ1446M",
        "FJ1447",
        "FJ1447M",
        "FJ1464",
        "FJ1464M"
      ]
    },
    {
      "key": "nguc-be",
      "name": {
        "vi": "Cơ ngực bé",
        "en": "Pectoralis minor",
        "zh": "胸小肌"
      },
      "latin": "M. pectoralis minor",
      "note": {
        "vi": "Từ xương sườn III–V tới mỏm quạ. Ba mức hạch nách trong ung thư vú được xác định theo cơ này: dưới, sau và trên cơ ngực bé.",
        "en": "From ribs 3–5 to the coracoid. The three levels of axillary nodes in breast cancer are defined by it: below, behind and above pectoralis minor.",
        "zh": "自第3–5肋至喙突。乳腺癌腋窝淋巴结三个水平以此肌划分：胸小肌下缘以下、后方和上缘以上。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1456",
        "FJ1456M"
      ]
    },
    {
      "key": "duoi-don",
      "name": {
        "vi": "Cơ dưới đòn",
        "en": "Subclavius",
        "zh": "锁骨下肌"
      },
      "latin": "M. subclavius",
      "note": {
        "vi": "Như đệm giữa xương đòn gãy và bó mạch dưới đòn phía dưới.",
        "en": "Acts as a cushion between a broken clavicle and the subclavian vessels beneath.",
        "zh": "如垫子般隔开骨折的锁骨与其下方的锁骨下血管。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1460",
        "FJ1460M"
      ]
    },
    {
      "key": "rang-truoc",
      "name": {
        "vi": "Cơ răng trước",
        "en": "Serratus anterior",
        "zh": "前锯肌"
      },
      "latin": "M. serratus anterior",
      "note": {
        "vi": "Các răng cưa bám tám xương sườn trên. Dây ngực dài chạy trên mặt ngoài cơ, dễ tổn thương khi nạo hạch nách, gây xương vai vểnh.",
        "en": "Its serrations grip the upper eight ribs. The long thoracic nerve runs on its surface and is at risk in axillary clearance, causing a winged scapula.",
        "zh": "锯齿附于上8肋。胸长神经行于其表面，腋窝清扫时易损伤，致翼状肩胛。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1459",
        "FJ1459M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch ngực–cùng vai và ngực ngoài",
        "en": "Thoraco-acromial and lateral thoracic arteries",
        "zh": "胸肩峰动脉与胸外侧动脉"
      },
      "latin": "A. thoracoacromialis · A. thoracica lateralis",
      "note": {
        "vi": "Nhánh ngực của động mạch ngực–cùng vai là cuống mạch của vạt cơ ngực lớn, loại vạt hay dùng trong phẫu thuật tái tạo đầu–cổ.",
        "en": "The pectoral branch of the thoraco-acromial artery is the pedicle of the pectoralis major flap, a workhorse in head and neck reconstruction.",
        "zh": "胸肩峰动脉胸肌支是胸大肌皮瓣的血管蒂，该皮瓣常用于头颈部重建。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1938",
        "FJ1976",
        "FJ2211",
        "FJ2230",
        "FJ2252",
        "FJ2263",
        "FJ2282",
        "FJ2304",
        "FJ2330",
        "FJ2361"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch ngực ngoài và tĩnh mạch đầu",
        "en": "Lateral thoracic and cephalic veins",
        "zh": "胸外侧静脉与头静脉"
      },
      "latin": "V. thoracica lateralis · V. cephalica",
      "note": {
        "vi": "Tĩnh mạch đầu chạy trong rãnh delta–ngực, mốc của đường mổ vào khớp vai phía trước.",
        "en": "The cephalic vein runs in the deltopectoral groove, the landmark for the anterior approach to the shoulder.",
        "zh": "头静脉行于三角胸肌沟内，是肩关节前入路的标志。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2233",
        "FJ2285"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương sườn, ức, đòn (mốc)",
        "en": "Ribs, sternum, clavicles (landmarks)",
        "zh": "肋骨、胸骨、锁骨（标志）"
      },
      "latin": "Costae · Sternum · Clavicula",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346",
        "FJ3347",
        "FJ3348",
        "FJ3153",
        "FJ3178",
        "FJ3290",
        "FJ3239",
        "FJ3242",
        "FJ3245",
        "FJ3248",
        "FJ3251",
        "FJ3254",
        "FJ3255",
        "FJ3333",
        "FJ3335",
        "FJ3337",
        "FJ3339",
        "FJ3341",
        "FJ3343",
        "FJ3345",
        "FJ3237",
        "FJ3362"
      ]
    }
  ]
});

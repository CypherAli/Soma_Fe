/**
 * Bài bộ phận "Lồng ngực — học theo lớp" học theo lớp — nhóm lấy từ thorax.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partThoraxScene: AtlasSceneDef = {
  "slug": "bo-phan-long-nguc",
  "title": {
    "vi": "Lồng ngực — học theo lớp",
    "en": "The Rib Cage — Layer by Layer",
    "zh": "胸廓——分层学习"
  },
  "latin": "Compages thoracis",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là xương ức và bảy đôi sườn thật, loại sườn nối thẳng vào xương ức. Bật lớp Sườn giả–cụt để thấy sườn VIII–XII. Bật lớp Sụn sườn để thấy khung sụn đàn hồi. Bật lớp Cột sống ngực để thấy mười hai đốt ngực khớp với các sườn phía sau.",
    "en": "It opens on the sternum and the seven pairs of true ribs, which join the sternum directly. Turn on False and floating ribs for ribs 8–12. Turn on Costal cartilages for the springy cartilage frame. Turn on Thoracic spine for the twelve vertebrae the ribs meet behind.",
    "zh": "打开时显示胸骨和直接连于胸骨的七对真肋。开启“假肋与浮肋”可见第8–12肋；开启“肋软骨”可见富有弹性的软骨框架；开启“胸椎”可见后方与肋相关节的十二块胸椎。"
  },
  "layers": [
    {
      "key": "that",
      "name": {
        "vi": "Xương ức, sườn thật",
        "en": "Sternum and true ribs",
        "zh": "胸骨与真肋"
      },
      "groups": [
        "xuong-uc",
        "suon-that"
      ],
      "on": true
    },
    {
      "key": "gia",
      "name": {
        "vi": "Sườn giả–cụt",
        "en": "False and floating ribs",
        "zh": "假肋与浮肋"
      },
      "groups": [
        "suon-gia",
        "suon-cut"
      ]
    },
    {
      "key": "sun",
      "name": {
        "vi": "Sụn sườn",
        "en": "Costal cartilages",
        "zh": "肋软骨"
      },
      "groups": [
        "sun-suon"
      ]
    },
    {
      "key": "song",
      "name": {
        "vi": "Cột sống ngực",
        "en": "Thoracic spine",
        "zh": "胸椎"
      },
      "groups": [
        "dot-song-nguc"
      ]
    }
  ],
  "groups": [
    {
      "key": "xuong-uc",
      "name": {
        "vi": "Xương ức",
        "en": "Sternum",
        "zh": "胸骨"
      },
      "latin": "Sternum",
      "note": {
        "vi": "Cán ức, thân ức và mũi ức. Chỗ nối cán–thân tạo góc ức (góc Louis) sờ được, ngang sụn sườn II — mốc đếm xương sườn và ngang mức chia đôi khí quản. Tim nằm ngay sau thân ức nên ép tim ngoài lồng ngực đặt tay ở nửa dưới xương ức.",
        "en": "Manubrium, body and xiphoid process. The manubriosternal junction forms the palpable sternal angle (of Louis) at the level of the second costal cartilage — the landmark for counting ribs and the level of the tracheal bifurcation. The heart lies directly behind the body, which is why chest compressions go on the lower half of the sternum.",
        "zh": "由胸骨柄、胸骨体和剑突组成。柄体结合处形成可触及的胸骨角（Louis角），平第二肋软骨——是计数肋骨的标志，也平气管分叉水平。心脏紧贴胸骨体后方，故胸外按压位于胸骨下半部。"
      },
      "tint": "#d9a066",
      "parts": [
        "FJ3153",
        "FJ3178",
        "FJ3290"
      ]
    },
    {
      "key": "suon-that",
      "name": {
        "vi": "Xương sườn thật (I–VII)",
        "en": "True ribs (I–VII)",
        "zh": "真肋（I–VII）"
      },
      "latin": "Costae verae I–VII",
      "note": {
        "vi": "Mỗi xương nối thẳng vào xương ức bằng sụn sườn riêng. Sườn I ngắn, dẹt, nằm sâu dưới xương đòn — động mạch và tĩnh mạch dưới đòn cùng đám rối cánh tay bắt chéo trên mặt nó, gốc của hội chứng lối thoát ngực.",
        "en": "Each joins the sternum directly by its own costal cartilage. Rib I is short and flat, tucked under the clavicle — the subclavian vessels and brachial plexus cross its upper surface, the basis of thoracic outlet syndrome.",
        "zh": "每根均借自身肋软骨直接连于胸骨。第一肋短而扁，藏于锁骨下方——锁骨下动、静脉及臂丛跨越其上面，是胸廓出口综合征的解剖基础。"
      },
      "tint": "#c98a5a",
      "parts": [
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346"
      ]
    },
    {
      "key": "suon-gia",
      "name": {
        "vi": "Xương sườn giả (VIII–X)",
        "en": "False ribs (VIII–X)",
        "zh": "假肋（VIII–X）"
      },
      "latin": "Costae spuriae VIII–X",
      "note": {
        "vi": "Sụn của chúng nhập vào sụn sườn ngay trên, tạo nên bờ sườn — mốc sờ gan, lách khi khám bụng. (Atlas thiếu các đoạn sụn này nên đầu trước xương sườn giả bị hở.)",
        "en": "Their cartilages join the cartilage above, forming the costal margin — the landmark for palpating the liver and spleen. (The atlas lacks these cartilages, so the front ends of the false ribs are open.)",
        "zh": "其肋软骨连于上位肋软骨，形成肋弓——是腹部触诊肝、脾的标志。（图谱缺少这些软骨，故假肋前端呈游离状。）"
      },
      "tint": "#e3c27a",
      "parts": [
        "FJ3225",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3347",
        "FJ3348"
      ]
    },
    {
      "key": "suon-cut",
      "name": {
        "vi": "Xương sườn cụt (XI–XII)",
        "en": "Floating ribs (XI–XII)",
        "zh": "浮肋（XI–XII）"
      },
      "latin": "Costae fluctuantes XI–XII",
      "note": {
        "vi": "Ngắn, đầu trước tự do trong thành bụng sau. Sườn XII bắt chéo mặt sau thận — vì vậy đường mổ vào thận hay đi dọc sườn XII, và gãy sườn cụt cần nghĩ tới dập thận.",
        "en": "Short, with free front ends in the posterior abdominal wall. Rib XII crosses the back of the kidney — which is why kidney incisions often follow rib XII, and why a fractured floating rib should raise suspicion of renal injury.",
        "zh": "短小，前端游离于腹后壁内。第十二肋斜跨肾后面——因此肾脏手术切口常沿第十二肋，浮肋骨折时应警惕肾挫伤。"
      },
      "tint": "#b9785a",
      "parts": [
        "FJ3226",
        "FJ3227",
        "FJ3331",
        "FJ3332"
      ]
    },
    {
      "key": "sun-suon",
      "name": {
        "vi": "Sụn sườn",
        "en": "Costal cartilages",
        "zh": "肋软骨"
      },
      "latin": "Cartilagines costales",
      "note": {
        "vi": "Sụn trong (sụn hyalin — không phải sụn chun) nối xương sườn với xương ức, cho lồng ngực dẻo khi thở và khi bị va đập. Người lớn tuổi sụn sườn cốt hoá dần nên lồng ngực kém đàn hồi. Atlas chỉ có sụn I–VII.",
        "en": "Elastic hyaline cartilage linking the ribs to the sternum, giving the cage flexibility for breathing and absorbing impacts. In older people the costal cartilages gradually ossify and the cage stiffens. The atlas only has cartilages I–VII.",
        "zh": "有弹性的透明软骨，连接肋骨与胸骨，使胸廓在呼吸和受撞击时具有柔韧性。老年人肋软骨逐渐骨化，胸廓弹性下降。图谱仅有第I–VII肋软骨。"
      },
      "tint": "#9fc6d6",
      "parts": [
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
        "FJ3345"
      ]
    },
    {
      "key": "dot-song-nguc",
      "name": {
        "vi": "Đốt sống ngực (T1–T12)",
        "en": "Thoracic vertebrae (T1–T12)",
        "zh": "胸椎（T1–T12）"
      },
      "latin": "Vertebrae thoracicae",
      "note": {
        "vi": "Thành sau lồng ngực. Mỗi xương sườn khớp với đốt sống ở hai chỗ: chỏm sườn với thân đốt, củ sườn với mỏm ngang — hai khớp này tạo trục cho xương sườn xoay khi thở.",
        "en": "The back wall of the cage. Each rib articulates with the spine at two points: its head with the vertebral bodies and its tubercle with the transverse process — together these form the axis about which the rib swings during breathing.",
        "zh": "胸廓后壁。每根肋骨在两处与脊柱相关节：肋头连椎体，肋结节连横突——两关节构成肋骨呼吸时转动的轴。"
      },
      "parts": [
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3158",
        "FJ3160",
        "FJ3163",
        "FJ3166",
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174",
        "FJ3175"
      ]
    }
  ]
};

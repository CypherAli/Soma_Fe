/**
 * Scene "Thực quản" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây X và hạch cạnh thực quản; lưới thực quản thô.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-oesophagus.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const oesophagusScene: AtlasSceneDef = {
  "slug": "thuc-quan",
  "title": {
    "vi": "Thực quản",
    "en": "The Oesophagus",
    "zh": "食管"
  },
  "latin": "Oesophagus",
  "intro": {
    "vi": "Thực quản dài khoảng 25cm từ sụn nhẫn (C6) tới tâm vị (T11), đi qua cổ, trung thất sau và xuyên cơ hoành. Nó có ba chỗ hẹp sinh lý do cấu trúc lân cận đè vào: sụn nhẫn (cách cung răng 15cm), cung động mạch chủ và phế quản gốc trái (25cm), lỗ cơ hoành (40cm) — nơi dị vật hay mắc và thuốc viên hay đọng gây loét. Mỗi cấu trúc một màu. Bộ dữ liệu không có dây X và hạch; lưới thực quản khá thô.",
    "en": "The oesophagus runs about 25cm from the cricoid (C6) to the cardia (T11), through the neck, the posterior mediastinum and the diaphragm. It has three physiological narrowings where neighbours press on it: the cricoid (15cm from the incisors), the aortic arch and left main bronchus (25cm), and the diaphragmatic hiatus (40cm) — where foreign bodies lodge and tablets linger to cause ulcers. Each structure has its own colour. The dataset lacks the vagus and lymph nodes; the oesophageal mesh is coarse.",
    "zh": "食管长约25cm，自环状软骨（C6）至贲门（T11），经颈部、后纵隔并穿膈。有三处生理性狭窄，由邻近结构压迫形成：环状软骨处（距切牙15cm）、主动脉弓与左主支气管交叉处（25cm）、膈食管裂孔处（40cm）——异物易嵌顿、药片易滞留致溃疡。各结构以不同颜色显示。数据集中无迷走神经和淋巴结；食管网格较粗糙。"
  },
  "groups": [
    {
      "key": "thuc-quan",
      "name": {
        "vi": "Thực quản",
        "en": "Oesophagus",
        "zh": "食管"
      },
      "latin": "Oesophagus",
      "note": {
        "vi": "1/3 trên cơ vân, 1/3 dưới cơ trơn. Ung thư biểu mô vảy hay ở 1/3 giữa (rượu, thuốc lá); ung thư tuyến ở 1/3 dưới trên nền Barrett do trào ngược lâu ngày. (Lưới trong dữ liệu thô — 296 tam giác cho 27cm.)",
        "en": "Its upper third is striated muscle, its lower third smooth. Squamous cancer favours the middle third (alcohol, smoking); adenocarcinoma arises in the lower third on Barrett's oesophagus from long-standing reflux. (The mesh here is coarse — 296 triangles for 27cm.)",
        "zh": "上1/3为横纹肌，下1/3为平滑肌。鳞癌好发于中1/3（饮酒、吸烟）；腺癌发生于下1/3，多在长期反流所致Barrett食管基础上。（此处网格较粗糙——27cm仅296个三角面。）"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ2563"
      ]
    },
    {
      "key": "hep-1",
      "name": {
        "vi": "Chỗ hẹp 1: sụn nhẫn và cơ khít hầu dưới (sụn giáp làm mốc)",
        "en": "Narrowing 1: cricoid and inferior constrictor (thyroid cartilage as landmark)",
        "zh": "第一狭窄：环状软骨与咽下缩肌（甲状软骨为标志）"
      },
      "latin": "Cartilago cricoidea",
      "note": {
        "vi": "Chỗ hẹp nhất, nơi cơ khít hầu dưới chuyển thành thực quản. Túi thừa Zenker lồi ra ở vùng yếu phía sau ngay trên chỗ này.",
        "en": "The narrowest point, where the inferior pharyngeal constrictor becomes the oesophagus. A Zenker diverticulum pouches out through the weak area just behind and above it.",
        "zh": "最狭窄处，咽下缩肌移行为食管。Zenker憩室自其后上方的薄弱区膨出。"
      },
      "tint": "#8fb3c9",
      "parts": [
        "FJ2440",
        "FJ2808",
        "FJ2740",
        "FJ2752"
      ]
    },
    {
      "key": "hep-2",
      "name": {
        "vi": "Chỗ hẹp 2: cung động mạch chủ và phế quản trái",
        "en": "Narrowing 2: aortic arch and left bronchus",
        "zh": "第二狭窄：主动脉弓与左主支气管"
      },
      "latin": "Arcus aortae · Bronchus principalis sinister",
      "note": {
        "vi": "Cung động mạch chủ và phế quản gốc trái đè lên thành trái thực quản ngang T4. Phình cung động mạch chủ có thể gây nuốt khó.",
        "en": "The aortic arch and left main bronchus press on the left wall of the oesophagus at T4. An aortic arch aneurysm can cause difficulty swallowing.",
        "zh": "主动脉弓和左主支气管于T4平面压迫食管左壁。主动脉弓动脉瘤可致吞咽困难。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1931",
        "FJ2450",
        "FJ3411"
      ]
    },
    {
      "key": "hep-3",
      "name": {
        "vi": "Chỗ hẹp 3: lỗ thực quản cơ hoành",
        "en": "Narrowing 3: diaphragmatic hiatus",
        "zh": "第三狭窄：膈食管裂孔"
      },
      "latin": "Diaphragma",
      "note": {
        "vi": "Trụ phải cơ hoành vòng quanh thực quản ngang T10 như một cơ thắt ngoài. Lỗ giãn rộng làm tâm vị trượt lên ngực — thoát vị khe thực quản.",
        "en": "The right crus loops around the oesophagus at T10 like an external sphincter. If the hiatus widens, the cardia slides up into the chest — a hiatus hernia.",
        "zh": "右膈脚于T10平面环绕食管，如同外括约肌。裂孔扩大时贲门滑入胸腔——即食管裂孔疝。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ3131"
      ]
    },
    {
      "key": "khi-quan",
      "name": {
        "vi": "Khí quản",
        "en": "Trachea",
        "zh": "气管"
      },
      "latin": "Trachea",
      "note": {
        "vi": "Nằm ngay trước thực quản ở cổ và trung thất trên. Rò khí-thực quản bẩm sinh ở trẻ gây sặc, tím khi bú.",
        "en": "Lies directly in front of the oesophagus in the neck and superior mediastinum. A congenital tracheo-oesophageal fistula makes newborns choke and turn blue when feeding.",
        "zh": "在颈部和上纵隔位于食管正前方。先天性气管食管瘘使新生儿喂奶时呛咳、发绀。"
      },
      "tint": "#9fc6d6",
      "parts": [
        "FJ2539",
        "FJ2541"
      ]
    },
    {
      "key": "tm-don",
      "name": {
        "vi": "Tĩnh mạch đơn",
        "en": "Azygos vein",
        "zh": "奇静脉"
      },
      "latin": "V. azygos",
      "note": {
        "vi": "Chạy bên phải thực quản trong trung thất sau; cung của nó vắt qua cuống phổi phải — phải thắt khi mổ cắt thực quản lối ngực phải.",
        "en": "Runs to the right of the oesophagus in the posterior mediastinum; its arch hooks over the right lung root and is divided in a right thoracic oesophagectomy.",
        "zh": "在后纵隔位于食管右侧；其弓跨过右肺根——经右胸食管切除术时需结扎切断。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1981",
        "FJ3416",
        "FJ3434"
      ]
    },
    {
      "key": "da-day",
      "name": {
        "vi": "Dạ dày và động mạch vị trái",
        "en": "Stomach and left gastric artery",
        "zh": "胃与胃左动脉"
      },
      "latin": "Gaster · A. gastrica sinistra",
      "note": {
        "vi": "Thực quản đổ vào tâm vị. Nhánh thực quản của động mạch vị trái nuôi đoạn bụng thực quản; tĩnh mạch đi kèm là vòng nối cửa–chủ.",
        "en": "The oesophagus enters the stomach at the cardia. Oesophageal branches of the left gastric artery supply its abdominal part; the accompanying veins form a portocaval anastomosis.",
        "zh": "食管于贲门处入胃。胃左动脉的食管支供应食管腹段；伴行静脉构成门-腔吻合。"
      },
      "tint": "#e8a37a",
      "parts": [
        "FJ2564",
        "FJ3499"
      ]
    }
  ]
};

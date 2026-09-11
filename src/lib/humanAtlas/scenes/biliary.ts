/**
 * Scene "Gan và đường mật" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-biliary.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const biliaryScene: AtlasSceneDef = {
  "slug": "gan-duong-mat",
  "title": {
    "vi": "Gan và đường mật",
    "en": "Liver and Biliary Tree",
    "zh": "肝与胆道"
  },
  "latin": "Hepar · Viae biliferae",
  "intro": {
    "vi": "Tế bào gan tiết mật vào các vi quản mật, gom dần thành ống mật phân thuỳ, ống gan phải và trái, hợp thành ống gan chung ở rốn gan. Ống túi mật nhập vào tạo ống mật chủ đổ vào tá tràng. Giữa bữa ăn cơ vòng Oddi đóng nên mật dồn ngược lên túi mật để cô đặc. Gan để mờ sẵn; đường mật xanh lá, túi mật xanh đậm, mạch cửa tím, động mạch đỏ.",
    "en": "Liver cells secrete bile into canaliculi, which gather into segmental ducts, then the right and left hepatic ducts, joining as the common hepatic duct at the hilum. The cystic duct joins it to form the common bile duct, which drains into the duodenum. Between meals the sphincter of Oddi is closed, so bile backs up into the gallbladder to be concentrated. The liver is pre-faded; bile ducts in green, gallbladder in dark green, portal vessels in violet, arteries in red.",
    "zh": "肝细胞将胆汁分泌至毛细胆管，逐级汇合为段胆管、左右肝管，在肝门处合成肝总管。胆囊管汇入后形成胆总管，开口于十二指肠。餐间Oddi括约肌关闭，胆汁逆流入胆囊浓缩。肝脏预先淡化；胆管为绿色，胆囊深绿，门静脉紫色，动脉红色。"
  },
  "fadedGroups": [
    "gan"
  ],
  "groups": [
    {
      "key": "ong-gan-chung",
      "name": {
        "vi": "Ống gan phải, trái và ống gan chung",
        "en": "Right, left and common hepatic ducts",
        "zh": "左、右肝管与肝总管"
      },
      "latin": "Ductus hepaticus communis",
      "note": {
        "vi": "Hai ống gan hợp ở rốn gan thành ống gan chung dài 3–4cm. U Klatskin (ung thư đường mật rốn gan) mọc đúng chỗ hợp lưu, gây vàng da tắc mật tăng dần.",
        "en": "The two hepatic ducts join at the hilum as the common hepatic duct, 3–4cm long. A Klatskin tumour (hilar cholangiocarcinoma) grows right at this confluence and causes progressive obstructive jaundice.",
        "zh": "左右肝管在肝门汇合成长3–4cm的肝总管。Klatskin瘤（肝门部胆管癌）恰生长于汇合处，引起进行性梗阻性黄疸。"
      },
      "tint": "#4f8a3a",
      "parts": [
        "FJ3079",
        "FJ3096",
        "FJ3123"
      ]
    },
    {
      "key": "ong-mat-phan-thuy",
      "name": {
        "vi": "Ống mật phân thuỳ",
        "en": "Segmental bile ducts",
        "zh": "段胆管"
      },
      "latin": "Ductus biliferi segmentorum",
      "note": {
        "vi": "Mỗi phân thuỳ Couinaud có ống mật riêng, đi cùng nhánh tĩnh mạch cửa và động mạch gan trong bao Glisson. Giãn đường mật trong gan trên siêu âm là dấu hiệu tắc ở dưới.",
        "en": "Each Couinaud segment has its own duct, running with the portal vein and hepatic artery branches in Glisson's sheath. Dilated intrahepatic ducts on ultrasound signal an obstruction further down.",
        "zh": "每个Couinaud肝段有自己的胆管，与门静脉支和肝动脉支同行于Glisson鞘内。超声显示肝内胆管扩张提示下游梗阻。"
      },
      "tint": "#7fb35a",
      "parts": [
        "FJ1883",
        "FJ3071",
        "FJ3072",
        "FJ3088",
        "FJ3089",
        "FJ3090",
        "FJ3103",
        "FJ3104",
        "FJ3105",
        "FJ3108",
        "FJ3109",
        "FJ3110"
      ]
    },
    {
      "key": "tui-mat",
      "name": {
        "vi": "Túi mật và ống túi mật",
        "en": "Gallbladder and cystic duct",
        "zh": "胆囊与胆囊管"
      },
      "latin": "Vesica biliaris · Ductus cysticus",
      "note": {
        "vi": "Ống túi mật có van xoắn Heister. Tam giác Calot (ống túi mật – ống gan chung – bờ gan) chứa động mạch túi mật: phải nhận diện rõ trước khi kẹp khi mổ cắt túi mật, không thì dễ kẹp nhầm ống mật chủ.",
        "en": "The cystic duct contains the spiral valve of Heister. Calot's triangle (cystic duct – common hepatic duct – liver edge) holds the cystic artery: it must be clearly identified before clipping in cholecystectomy, or the common bile duct may be clipped by mistake.",
        "zh": "胆囊管内有Heister螺旋瓣。Calot三角（胆囊管—肝总管—肝下缘）内有胆囊动脉：胆囊切除术中夹闭前必须清楚辨认，否则易误夹胆总管。"
      },
      "tint": "#3f6a2f",
      "parts": [
        "FJ2817",
        "FJ3080"
      ]
    },
    {
      "key": "tm-cua",
      "name": {
        "vi": "Tĩnh mạch cửa",
        "en": "Portal vein",
        "zh": "门静脉"
      },
      "latin": "V. portae hepatis",
      "note": {
        "vi": "Nằm sau cùng trong cuống gan (sau ống mật chủ và động mạch gan). Nghiệm pháp Pringle — kẹp cuống gan — cắt cả dòng cửa lẫn động mạch để cầm máu khi mổ gan.",
        "en": "The most posterior structure in the hepatic pedicle (behind the bile duct and hepatic artery). The Pringle manoeuvre — clamping the pedicle — stops both portal and arterial inflow to control bleeding in liver surgery.",
        "zh": "位于肝蒂最后方（在胆总管和肝动脉之后）。Pringle手法——阻断肝蒂——同时阻断门静脉和肝动脉血流，用于肝手术止血。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ1853",
        "FJ1893",
        "FJ1913",
        "FJ1914",
        "FJ2404",
        "FJ2405",
        "FJ3073",
        "FJ3074",
        "FJ3102",
        "FJ3111",
        "FJ3112",
        "FJ3113",
        "FJ3122",
        "FJ3124",
        "FJ3125",
        "FJ3126",
        "FJ3127",
        "FJ3128"
      ]
    },
    {
      "key": "dm-gan",
      "name": {
        "vi": "Động mạch gan",
        "en": "Hepatic artery",
        "zh": "肝动脉"
      },
      "latin": "A. hepatica",
      "note": {
        "vi": "Nguồn nuôi DUY NHẤT của đường mật. Biến thể giải phẫu rất hay gặp (động mạch gan phải tách từ mạc treo tràng trên ở ~15% người) — phải biết trước khi mổ.",
        "en": "The ONLY blood supply of the bile ducts. Anatomical variants are very common (a right hepatic artery arising from the SMA in ~15%) — they must be known before surgery.",
        "zh": "胆管的唯一血供。解剖变异非常常见（约15%的人右肝动脉发自肠系膜上动脉）——术前必须明确。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1874",
        "FJ1916",
        "FJ1924",
        "FJ3075",
        "FJ3076",
        "FJ3078",
        "FJ3081",
        "FJ3091",
        "FJ3092",
        "FJ3093",
        "FJ3095",
        "FJ3106",
        "FJ3107",
        "FJ3114",
        "FJ3115",
        "FJ3116",
        "FJ3117"
      ]
    },
    {
      "key": "ta-trang",
      "name": {
        "vi": "Tá tràng (nơi mật đổ vào)",
        "en": "Duodenum (where bile enters)",
        "zh": "十二指肠（胆汁排入处）"
      },
      "latin": "Duodenum",
      "note": {
        "vi": "Mật đổ vào đoạn hai tá tràng qua bóng Vater, cùng dịch tuỵ. Để màu gốc làm mốc.",
        "en": "Bile enters the second part of the duodenum at the ampulla of Vater, together with pancreatic juice. Shown in natural colour as a landmark.",
        "zh": "胆汁与胰液一同经Vater壶腹排入十二指肠降部。以原色作为标志。"
      },
      "parts": [
        "FJ2573"
      ]
    },
    {
      "key": "gan",
      "name": {
        "vi": "Nhu mô gan",
        "en": "Liver parenchyma",
        "zh": "肝实质"
      },
      "latin": "Hepar",
      "note": {
        "vi": "Tám phân thuỳ gộp một màu, làm mờ sẵn để nhìn thấu cây mật. Chi tiết từng phân thuỳ ở bài Giải phẫu Gan.",
        "en": "The eight segments in one colour, pre-faded so the biliary tree shows through. Segment detail is in the Liver Anatomy lesson.",
        "zh": "八个肝段合为一色并预先淡化，以透视胆道树。各肝段详见“肝脏解剖”一课。"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ2816",
        "FJ2818",
        "FJ2819",
        "FJ2820",
        "FJ2821",
        "FJ2822",
        "FJ2823",
        "FJ2824"
      ]
    }
  ]
};

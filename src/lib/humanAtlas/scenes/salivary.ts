
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Sàn miệng và tuyến nước bọt" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu tuyến mang tai và các ống tiết (ống Wharton, ống Stensen).
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const salivaryScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/salivary.ts#salivaryScene", {
  "slug": "tuyen-nuoc-bot",
  "title": {
    "vi": "Tuyến dưới hàm, dưới lưỡi và sàn miệng",
    "en": "Submandibular and Sublingual Glands and the Floor of the Mouth",
    "zh": "下颌下腺、舌下腺与口底"
  },
  "latin": "Glandulae submandibularis et sublingualis",
  "intro": {
    "vi": "Có ba đôi tuyến nước bọt lớn: mang tai, dưới hàm và dưới lưỡi. Bộ dữ liệu không có tuyến mang tai. Cơ hàm–móng là mốc then chốt vì nó chia sàn miệng thành hai tầng. Tuyến dưới lưỡi nằm trên cơ. Tuyến dưới hàm vòng quanh bờ sau cơ, phần lớn nằm dưới trong tam giác dưới hàm. Tuyến dưới hàm tiết khoảng 70% nước bọt lúc nghỉ. Ống của nó dài và đi ngược lên nên hay bị sỏi. Mỗi tuyến một màu, cơ sàn miệng tông cam; xương hàm dưới mờ sẵn. Chú ý: bộ dữ liệu không có ống tiết.",
    "en": "There are three pairs of major salivary glands: parotid, submandibular and sublingual; the dataset has no parotid. Mylohyoid is the key landmark because it divides the floor of the mouth into two storeys. The sublingual gland lies above it. The submandibular gland wraps round its back edge, with most of the gland below it in the submandibular triangle. The submandibular gland makes about 70% of resting saliva. Its duct is long and runs uphill, so it is the commonest site of salivary stones. Each gland has its own colour and the floor muscles are orange; the mandible is faded. Note: the dataset has no ducts.",
    "zh": "大唾液腺有三对：腮腺、下颌下腺、舌下腺；数据集中无腮腺。下颌舌骨肌是关键标志，将口底分为上下两层：舌下腺位于其上；下颌下腺绕其后缘，大部位于其下方的下颌下三角内。下颌下腺分泌约70%的静息唾液，其导管长且向上走行，最易形成涎石。每个腺一种颜色，口底肌橙色；下颌骨淡化。注意：数据集中无导管。"
  },
  "frameGroups": [
    "duoi-ham",
    "duoi-luoi",
    "ham-mong",
    "khac"
  ],
  "fadedGroups": [
    "ham"
  ],
  "groups": [
    {
      "key": "duoi-ham",
      "name": {
        "vi": "Tuyến dưới hàm",
        "en": "Submandibular gland",
        "zh": "下颌下腺"
      },
      "latin": "Glandula submandibularis",
      "note": {
        "vi": "Sờ được dưới bờ hàm dưới. Ống Wharton mở ở cục dưới lưỡi, cạnh hãm lưỡi. Mổ lấy tuyến có nguy cơ tổn thương nhánh bờ hàm dưới của dây VII, dây lưỡi và dây XII.",
        "en": "Palpable under the lower border of the mandible. Wharton's duct opens at the sublingual papilla beside the frenulum. Removing the gland risks the marginal mandibular branch of VII, the lingual nerve and nerve XII.",
        "zh": "可于下颌骨下缘下方触及。下颌下腺管（Wharton管）开口于舌系带旁的舌下阜。切除该腺有损伤面神经下颌缘支、舌神经和舌下神经的风险。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ2766",
        "FJ2768"
      ]
    },
    {
      "key": "duoi-luoi",
      "name": {
        "vi": "Tuyến dưới lưỡi",
        "en": "Sublingual gland",
        "zh": "舌下腺"
      },
      "latin": "Glandula sublingualis",
      "note": {
        "vi": "Nhỏ nhất, nằm ngay dưới niêm mạc sàn miệng, đổ bằng nhiều ống nhỏ. Tắc ống tạo nang nhái (ranula).",
        "en": "The smallest, just under the mucosa of the floor of the mouth, draining by many small ducts. A blocked duct forms a ranula.",
        "zh": "最小，位于口底黏膜下，借多条小管开口。导管阻塞形成舌下囊肿（蛤蟆肿）。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ2765",
        "FJ2767"
      ]
    },
    {
      "key": "ham-mong",
      "name": {
        "vi": "Cơ hàm–móng (hoành miệng)",
        "en": "Mylohyoid (the oral diaphragm)",
        "zh": "下颌舌骨肌（口膈）"
      },
      "latin": "M. mylohyoideus",
      "note": {
        "vi": "Hai cơ gặp nhau ở đường giữa như một cái võng. Nhiễm trùng răng hàm dưới lan dưới cơ này có thể gây viêm tấy sàn miệng (Ludwig), đẩy lưỡi lên và làm tắc đường thở.",
        "en": "The two muscles meet in the midline like a hammock. Infection from the lower molars spreading below it can cause Ludwig's angina, pushing the tongue up and blocking the airway.",
        "zh": "两侧肌在中线相会如吊床。下颌磨牙感染蔓延至其下方可致路德维希咽峡炎，将舌推高而阻塞气道。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1562",
        "FJ1583"
      ]
    },
    {
      "key": "khac",
      "name": {
        "vi": "Cơ hai bụng, cằm–móng, móng–lưỡi",
        "en": "Digastric, geniohyoid, hyoglossus",
        "zh": "二腹肌、颏舌骨肌、舌骨舌肌"
      },
      "latin": "Mm. digastricus, geniohyoideus, hyoglossus",
      "note": {
        "vi": "Hai bụng cơ hai bụng cùng bờ hàm dưới tạo tam giác dưới hàm. Cơ móng–lưỡi là mốc: ống tuyến dưới hàm và dây lưỡi đi mặt ngoài cơ.",
        "en": "The two bellies of digastric and the lower border of the mandible form the submandibular triangle. Hyoglossus is a landmark: the submandibular duct and lingual nerve run on its outer surface.",
        "zh": "二腹肌两腹与下颌骨下缘围成下颌下三角。舌骨舌肌为标志：下颌下腺管和舌神经行于其外侧面。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1555",
        "FJ1556",
        "FJ1559",
        "FJ1560",
        "FJ1578",
        "FJ1579",
        "FJ1580",
        "FJ2739",
        "FJ2751"
      ]
    },
    {
      "key": "luoi",
      "name": {
        "vi": "Lưỡi và xương móng",
        "en": "Tongue and hyoid",
        "zh": "舌与舌骨"
      },
      "latin": "Lingua · Os hyoideum",
      "note": {
        "vi": "Tuyến dưới lưỡi nằm hai bên gốc lưỡi, dưới niêm mạc.",
        "en": "The sublingual glands lie either side of the root of the tongue, under the mucosa.",
        "zh": "舌下腺位于舌根两侧的黏膜下。"
      },
      "tint": "#d98fa0",
      "parts": [
        "FJ2761",
        "FJ2772"
      ]
    },
    {
      "key": "ham",
      "name": {
        "vi": "Xương hàm dưới (mốc)",
        "en": "Mandible (landmark)",
        "zh": "下颌骨（标志）"
      },
      "latin": "Mandibula",
      "note": {
        "vi": "Mờ sẵn. Hố dưới hàm ở mặt trong xương, dưới đường hàm–móng, chứa tuyến dưới hàm.",
        "en": "Faded. The submandibular fossa on its inner surface, below the mylohyoid line, holds the submandibular gland.",
        "zh": "淡化。其内面下颌舌骨线下方的下颌下窝容纳下颌下腺。"
      },
      "parts": [
        "FJ3289"
      ]
    }
  ]
});

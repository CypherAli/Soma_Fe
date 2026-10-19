
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Hệ tĩnh mạch chủ và tĩnh mạch cửa" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-caval-portal.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const cavalPortalScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/caval-portal.ts#cavalPortalScene", {
  "slug": "he-tinh-mach-chu-cua",
  "title": {
    "vi": "Hệ tĩnh mạch chủ và tĩnh mạch cửa",
    "en": "Caval and Portal Venous Systems",
    "zh": "腔静脉与门静脉系统"
  },
  "latin": "Systema venae cavae et venae portae",
  "intro": {
    "vi": "Máu tĩnh mạch về tim theo hai đường. Hệ chủ (xanh): tĩnh mạch chủ trên gom máu đầu, cổ, tay; tĩnh mạch chủ dưới gom máu chân, chậu, thận. Hệ cửa (tím): máu từ dạ dày, ruột, lách, tuỵ KHÔNG về thẳng tim mà qua tĩnh mạch cửa vào gan xử lý trước. Hai hệ nối nhau ở vài vòng nối cửa–chủ; khi gan xơ, máu dồn qua đó gây giãn tĩnh mạch thực quản. Hệ tĩnh mạch đơn nối chủ trên với chủ dưới.",
    "en": "Venous blood returns to the heart by two routes. The caval system (blue): the superior vena cava drains the head, neck and arms; the inferior vena cava drains the legs, pelvis and kidneys. The portal system (violet): blood from the stomach, intestines, spleen and pancreas does NOT go straight to the heart but passes through the portal vein into the liver to be processed first. The two systems meet at a few portocaval anastomoses; in cirrhosis blood is forced through them, causing oesophageal varices. The azygos system links the superior and inferior venae cavae.",
    "zh": "静脉血经两条途径回心。腔静脉系统（蓝色）：上腔静脉收集头、颈、上肢的血液；下腔静脉收集下肢、盆腔、肾脏的血液。门静脉系统（紫色）：来自胃、肠、脾、胰的血液并不直接回心，而是先经门静脉入肝处理。两系统借数处门-腔吻合相连；肝硬化时血液被迫经此分流，形成食管静脉曲张。奇静脉系统连接上、下腔静脉。"
  },
  "groups": [
    {
      "key": "tm-chu-tren",
      "name": {
        "vi": "Tĩnh mạch chủ trên và nhánh",
        "en": "Superior vena cava and tributaries",
        "zh": "上腔静脉及属支"
      },
      "latin": "V. cava superior",
      "note": {
        "vi": "Hai tĩnh mạch cánh tay đầu (mỗi bên do tĩnh mạch cảnh trong + dưới đòn hợp lại) nhập thành tĩnh mạch chủ trên, đổ vào nhĩ phải. U phổi thuỳ trên phải chèn nó gây hội chứng tĩnh mạch chủ trên: phù mặt, cổ, tay. (Lưới tĩnh mạch chủ trong dữ liệu khá thô.)",
        "en": "The two brachiocephalic veins (each formed by the internal jugular and subclavian) join as the superior vena cava, which empties into the right atrium. A right upper-lobe lung tumour compressing it causes superior vena cava syndrome: swelling of the face, neck and arms. (The caval mesh in this dataset is coarse.)",
        "zh": "两侧头臂静脉（各由颈内静脉与锁骨下静脉汇成）合成上腔静脉，注入右心房。右肺上叶肿瘤压迫可致上腔静脉综合征：面、颈、上肢水肿。（数据中腔静脉网格较粗糙。）"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3482",
        "FJ3485",
        "FJ3486",
        "FJ3583",
        "FJ3585",
        "FJ3587",
        "FJ3645"
      ]
    },
    {
      "key": "tm-don",
      "name": {
        "vi": "Hệ tĩnh mạch đơn",
        "en": "Azygos system",
        "zh": "奇静脉系统"
      },
      "latin": "V. azygos · V. hemiazygos",
      "note": {
        "vi": "Tĩnh mạch đơn (bên phải) gom máu thành ngực; tĩnh mạch bán đơn và bán đơn phụ (bên trái) bắt chéo trước cột sống ngang T7–T9 để đổ vào tĩnh mạch đơn. Chỉ có cung tĩnh mạch đơn vòng qua cuống phổi phải đổ vào tĩnh mạch chủ trên. Phía dưới hệ này nối với tĩnh mạch thắt lưng lên — đường vòng khi tĩnh mạch chủ dưới bị tắc.",
        "en": "The azygos vein (right) drains the chest wall; the hemiazygos and accessory hemiazygos (left) cross in front of the spine at about T7–T9 to join the azygos. Only the arch of the azygos hooks over the right lung root into the superior vena cava. Below, the system connects with the ascending lumbar veins — a bypass when the inferior vena cava is blocked.",
        "zh": "奇静脉（右侧）收集胸壁血液；半奇静脉和副半奇静脉（左侧）约在T7–T9平面横过脊柱前方汇入奇静脉。只有奇静脉弓跨右肺根注入上腔静脉。其下方与腰升静脉相连——下腔静脉阻塞时的侧支通路。"
      },
      "tint": "#6f8fb0",
      "parts": [
        "FJ1981",
        "FJ1986",
        "FJ1991",
        "FJ3416",
        "FJ3434",
        "FJ3493",
        "FJ3589",
        "FJ3658"
      ]
    },
    {
      "key": "tm-chu-duoi",
      "name": {
        "vi": "Tĩnh mạch chủ dưới",
        "en": "Inferior vena cava",
        "zh": "下腔静脉"
      },
      "latin": "V. cava inferior",
      "note": {
        "vi": "Tĩnh mạch lớn nhất, chạy bên PHẢI động mạch chủ bụng, xuyên cơ hoành ngang T8 vào nhĩ phải. Nhận tĩnh mạch gan ngay dưới cơ hoành. (Lưới gốc thô — ống ép đùn ít tam giác.)",
        "en": "The largest vein, running to the RIGHT of the abdominal aorta and piercing the diaphragm at T8 to reach the right atrium. It receives the hepatic veins just below the diaphragm. (The source mesh is coarse — an extruded tube with few triangles.)",
        "zh": "最大的静脉，位于腹主动脉右侧，于T8平面穿膈入右心房，在膈下接受肝静脉。（原始网格较粗糙——三角面较少的挤出管。）"
      },
      "tint": "#3f6a8f",
      "parts": [
        "FJ3441",
        "FJ3659"
      ]
    },
    {
      "key": "tm-than",
      "name": {
        "vi": "Nhánh bụng của TM chủ dưới (thận, thượng thận, tinh hoàn, hoành dưới, thắt lưng)",
        "en": "Abdominal tributaries of the IVC (renal, suprarenal, testicular, inferior phrenic, lumbar)",
        "zh": "下腔静脉腹部属支（肾、肾上腺、睾丸、膈下、腰静脉）"
      },
      "latin": "Vv. renales, suprarenales, testiculares, phrenicae inferiores, lumbales",
      "note": {
        "vi": "Tĩnh mạch thận TRÁI dài, bắt chéo trước động mạch chủ và nhận cả tĩnh mạch thượng thận và tinh hoàn trái; bên phải các tĩnh mạch này đổ thẳng vào chủ dưới. Vì vậy giãn tĩnh mạch thừng tinh hay gặp bên trái, và tĩnh mạch thận trái có thể bị kẹp giữa động mạch chủ và mạc treo tràng trên (hội chứng kẹp hạt dẻ).",
        "en": "The LEFT renal vein is long, crosses in front of the aorta and also receives the left suprarenal and testicular veins; on the right these drain straight into the IVC. That is why varicocele is usually left-sided, and why the left renal vein can be pinched between the aorta and superior mesenteric artery (nutcracker syndrome).",
        "zh": "左肾静脉较长，跨腹主动脉前方，并接受左肾上腺静脉和左睾丸静脉；右侧这些静脉直接注入下腔静脉。因此精索静脉曲张多见于左侧，左肾静脉也可被夹于主动脉与肠系膜上动脉之间（胡桃夹综合征）。"
      },
      "tint": "#7aa3c8",
      "parts": [
        "FJ3447",
        "FJ3448",
        "FJ3449",
        "FJ3450",
        "FJ3451",
        "FJ3452",
        "FJ3477",
        "FJ3478",
        "FJ3480",
        "FJ3533",
        "FJ3577",
        "FJ3578",
        "FJ3580",
        "FJ3618",
        "FJ3631",
        "FJ3635"
      ]
    },
    {
      "key": "tm-chau",
      "name": {
        "vi": "Tĩnh mạch chậu",
        "en": "Iliac veins",
        "zh": "髂静脉"
      },
      "latin": "Vv. iliacae",
      "note": {
        "vi": "Hai tĩnh mạch chậu chung hợp lại ngang L5 thành tĩnh mạch chủ dưới. Tĩnh mạch chậu chung trái bị động mạch chậu chung phải đè lên (hội chứng May-Thurner) — lý do huyết khối tĩnh mạch sâu hay gặp ở chân trái.",
        "en": "The two common iliac veins join at L5 to form the IVC. The left common iliac vein is crossed and compressed by the right common iliac artery (May-Thurner syndrome) — the reason deep vein thrombosis favours the left leg.",
        "zh": "两侧髂总静脉在L5平面汇合成下腔静脉。左髂总静脉被右髂总动脉跨越压迫（May-Thurner综合征）——这是深静脉血栓好发于左下肢的原因。"
      },
      "tint": "#6a93b8",
      "parts": [
        "FJ3465",
        "FJ3469",
        "FJ3470",
        "FJ3471",
        "FJ3484",
        "FJ3510",
        "FJ3522",
        "FJ3523",
        "FJ3524",
        "FJ3526",
        "FJ3541",
        "FJ3566",
        "FJ3568",
        "FJ3570",
        "FJ3571",
        "FJ3572",
        "FJ3603",
        "FJ3607",
        "FJ3608",
        "FJ3609",
        "FJ3611"
      ]
    },
    {
      "key": "tm-gan",
      "name": {
        "vi": "Tĩnh mạch gan",
        "en": "Hepatic veins",
        "zh": "肝静脉"
      },
      "latin": "Vv. hepaticae",
      "note": {
        "vi": "Điểm cuối của hệ cửa: máu đã qua gan đổ ra ba tĩnh mạch gan rồi vào tĩnh mạch chủ dưới. Tắc chúng (Budd-Chiari) gây gan to, cổ trướng.",
        "en": "The exit of the portal system: blood that has passed through the liver leaves by three hepatic veins into the IVC. Their occlusion (Budd-Chiari) causes an enlarged liver and ascites.",
        "zh": "门静脉系统的出口：流经肝脏的血液经三条肝静脉汇入下腔静脉。其阻塞（布-加综合征）导致肝大和腹水。"
      },
      "tint": "#4f7fa6",
      "parts": [
        "FJ2414",
        "FJ2415",
        "FJ2416"
      ]
    },
    {
      "key": "tm-cua",
      "name": {
        "vi": "Tĩnh mạch cửa",
        "en": "Hepatic portal vein",
        "zh": "肝门静脉"
      },
      "latin": "V. portae hepatis",
      "note": {
        "vi": "Tĩnh mạch lách và mạc treo tràng trên hợp lại sau cổ tuỵ thành tĩnh mạch cửa, lên rốn gan chia nhánh phải, trái. Mang khoảng 75% máu vào gan. Tăng áp cửa mở các vòng nối cửa–chủ: thực quản (giãn tĩnh mạch thực quản), quanh rốn (đầu sứa), trực tràng.",
        "en": "The splenic and superior mesenteric veins join behind the neck of the pancreas to form the portal vein, which rises to the porta hepatis and divides into right and left branches. It carries about 75% of the liver's blood. Portal hypertension opens the portocaval anastomoses: oesophageal (varices), periumbilical (caput medusae) and rectal.",
        "zh": "脾静脉与肠系膜上静脉在胰颈后方汇合成门静脉，上行至肝门分为左、右支，供应肝脏约75%的血流。门静脉高压使门-腔吻合开放：食管（静脉曲张）、脐周（海蛇头）、直肠。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ1853",
        "FJ1893",
        "FJ1913",
        "FJ2404",
        "FJ2405",
        "FJ3102",
        "FJ3122"
      ]
    },
    {
      "key": "nhanh-cua",
      "name": {
        "vi": "Tĩnh mạch lách, mạc treo và vị",
        "en": "Splenic, mesenteric and gastric veins",
        "zh": "脾、肠系膜及胃静脉"
      },
      "latin": "V. splenica · Vv. mesentericae",
      "note": {
        "vi": "Các nhánh gốc của hệ cửa. Tĩnh mạch mạc treo tràng dưới thường đổ vào tĩnh mạch lách; tĩnh mạch vị trái (vành vị) nối với tĩnh mạch thực quản — chính là đường vòng tạo giãn tĩnh mạch thực quản khi tăng áp cửa.",
        "en": "The root tributaries of the portal system. The inferior mesenteric vein usually drains into the splenic vein; the left gastric (coronary) vein connects with the oesophageal veins — exactly the bypass that forms oesophageal varices in portal hypertension.",
        "zh": "门静脉系统的起始属支。肠系膜下静脉通常汇入脾静脉；胃左静脉（胃冠状静脉）与食管静脉相通——正是门静脉高压时形成食管静脉曲张的侧支通路。"
      },
      "tint": "#9483bf",
      "parts": [
        "FJ3443",
        "FJ3500",
        "FJ3502",
        "FJ3545",
        "FJ3595",
        "FJ3597",
        "FJ3641",
        "FJ3646",
        "FJ3647",
        "FJ3655"
      ]
    }
  ]
});

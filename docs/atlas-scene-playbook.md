# Sổ tay dựng scene chuyên đề trên atlas BodyParts3D

Viết ngày 10/09/2026, sau khi hoàn thành scene mẫu **Giải phẫu Tim**.
Mọi scene tiếp theo làm đúng theo đây thì ra cùng chất lượng.

---

## 1. Kiến trúc — đọc trước khi làm

Scene chuyên đề **không phải một file `.glb`**. Nó là một **danh sách mã mảnh**
trong atlas toàn thân, cộng nội dung dạy học ba ngôn ngữ.

```
public/human-atlas/              atlas.json + 15 chunk .bin/.bin.gz (90MB, CC BY 4.0)
src/lib/humanAtlas/
  anatomy.ts                     15 hệ, SceneState, ATLAS_MANIFEST
  roomEnvironment.ts             BẢN r159 ĐÓNG BĂNG — xem bẫy #6
  scenes/types.ts                AtlasSceneDef, AtlasSceneGroup, scenePartIds/…
  scenes/heart.ts                SINH TỰ ĐỘNG — đừng sửa tay
  scenes/index.ts                danh mục slug -> scene
src/components/viewer/atlas/
  AtlasScene.tsx                 bộ dựng hình dùng chung (toàn thân + chuyên đề)
  AtlasSceneViewer.tsx           giao diện trang chuyên đề
  AtlasViewer.tsx                giao diện trang toàn thân
scripts/atlas/gen-scene-heart.mjs  bộ sinh dữ liệu scene
src/app/[locale]/viewer/atlas.css   toàn bộ CSS khu atlas
```

Route `/giai-phau/mo-hinh/[slug]` tra `atlasScenes[slug]` **trước**; không có
thì lùi về `SceneModule` (Z-Anatomy) như cũ. Nhờ vậy chuyển từng scene một
được, 121 trang còn lại vẫn chạy.

**Hệ quả quan trọng:** mọi scene dùng chung `AtlasScene` nên **tự động có** tách
rời, mặt cắt lát, cô lập, ẩn/làm mờ, ánh sáng, màu. Thêm scene = thêm một file
dữ liệu, không viết thêm component nào.

---

## 2. Quy trình dựng một scene mới

### Bước 1 — Khảo sát dữ liệu trước khi viết một dòng nào

```bash
node -e "
const a=require('./public/human-atlas/atlas.json');
const f=(q)=>a.parts.filter(p=>new RegExp(q,'i').test(p.name));
f('lobe of lung|bronchopulmonary').forEach(p=>console.log(p.id,p.system,p.name));
"
```

Ba câu hỏi phải trả lời bằng số, không phải bằng cảm giác:

1. **Atlas có đủ cấu trúc cho bài này không?** Xem `docs/atlas-coverage.md`.
   Nếu thiếu (tai giữa, cơ nhai, cơ mặt, hạch bạch huyết, mạc, tuỷ sống) thì
   **giữ Z-Anatomy**, đừng chuyển.
2. **Có mảnh nào bị xếp nhầm hệ không?** (bẫy #1)
3. **Có mảnh nào lưới quá thô hoặc chạy dài ra ngoài vùng bài không?** (bẫy #2)

```bash
# đo lưới thô: tam giác / kích thước / tỉ lệ dài-mảnh
node -e "…p.indexCount/3, bounds…"
```

### Bước 2 — Chép `gen-scene-heart.mjs` thành `gen-scene-<slug>.mjs`

Sửa 4 chỗ: `EXCLUDE`, bảng `groups`, `frameGroups`, khối `title/intro`.

Quy tắc chia nhóm — **theo cách sinh viên y tra bài**, không theo cách dữ liệu
xếp sẵn:

- Mỗi nhóm là **một cấu trúc giải phẫu có tên**, gộp đủ phần của nó
  (ví dụ "Tâm thất phải" = lòng buồng + cơ nhú của chính nó).
- Tên `T3` (vi/en/zh) + `latin` + `note` viết cho người học, nêu **cơ chế** chứ
  không chỉ mô tả hình.
- Nếu dữ liệu có giới hạn thì **ghi thẳng vào `note`**, đừng giấu.
  Ví dụ: "hai thất dùng CHUNG một khối thành, không tách riêng được".

### Bước 3 — Sinh và đăng ký

```bash
node scripts/atlas/gen-scene-<slug>.mjs
# rồi thêm vào src/lib/humanAtlas/scenes/index.ts
```

### Bước 4 — Kiểm bắt buộc (đủ 8 mục)

| # | Kiểm | Đạt khi |
|---|---|---|
| 1 | `npx tsc --noEmit` | sạch |
| 2 | `npx eslint src/components/viewer/atlas src/lib/humanAtlas` | sạch |
| 3 | Mở trang ở **tab mới** | không lỗi console |
| 4 | Khung ngắm lúc nguyên khối | chủ thể đầy khung, không lệch |
| 5 | Tách rời 25% / 50% / 100% | mảnh toả đều, luôn trong khung |
| 6 | Mặt cắt X / Y / Z ở 25% và 50% | cắt đúng giữa chủ thể, không thủng đen |
| 7 | Mặt cắt + tách rời **đồng thời** | mỗi mảnh giữ mặt cắt của nó |
| 8 | Bấm nhãn → Ẩn / Làm mờ / Cô lập | đúng số mảnh, model không giật |

Kiểm ở **cả hai chế độ sáng/tối** và **cả ba ngôn ngữ** (`/vi`, `/en`, `/zh`).

---

## 3. Bảy cái bẫy đã trả giá — đừng dẫm lại

### #1 — `system` của atlas xếp nhầm

Hệ `cardiac` có 23 mảnh thì **5 mảnh là NÃO THẤT** (Third/Fourth/lateral
ventricle, interventricular foramen) — human-atlas gộp nhầm vì trùng chữ
"ventricle". **Không bao giờ lấy nguyên `system === '…'`**; luôn liệt kê theo
tên và kiểm lại danh sách sinh ra.

### #2 — Lưới thô và mảnh chạy dài

Tĩnh mạch chủ dưới: **324 tam giác** cho ống dài 9,6cm (tỉ lệ dài/mảnh 4,2) —
hình trụ ép đùn, nhìn như cái cọc. So sánh: thành thất 8.236 tam giác cho 10,2cm.

Đo trước, rồi quyết: bỏ hẳn (`EXCLUDE`), hoặc giữ nhưng loại khỏi `frameGroups`,
hoặc giữ và ghi rõ hạn chế trong `note`.

### #3 — Màu theo HỆ là dạy sai

Atlas tô `arterial` đỏ, `venous` xanh. Vòng tiểu tuần hoàn là ngoại lệ lớn nhất:
động mạch phổi mang máu **nghèo** oxy (phải xanh), tĩnh mạch phổi mang máu
**giàu** oxy (phải đỏ).

Dùng `tint` của nhóm để ghi đè. Quy ước đã chốt: `DEOXY = #527c9f`,
`OXY = #c05245` (lấy đúng palette atlas để không lệch tông).

### #4 — Khung ngắm bị tham số của trang toàn thân kéo lệch

Ba con số trong `AtlasScene.tsx` được hiệu chỉnh cho **cơ thể cao 1,7m**; áp vào
một scene 9cm là hỏng. Đã sửa cả ba, nhưng phải hiểu khi động vào:

- biên độ tách rời `0.48m` → nay tỉ lệ theo `sceneRadius`
- mốc "chưa tách" của `fit()` là người ở khoảng cách 4 → nay là `sceneDistance`
- `packX = -packingWidth*.12` (né bảng lớp 340px) → nay `0` ở trang chuyên đề

### #5 — Mặt cắt phải tính theo hộp bao SCENE

Hộp toàn thân Y = 0 → 1,730 nên 50% rơi vào y 0,865 (ngang hông), trong khi quả
tim ở 1,252 → 1,395: thanh trượt vừa nhích là cắt trượt hết bài. `clipBoxOf()`
đã xử lý — đừng đổi về `atlasBox`.

### #6 — `RoomEnvironment` đổi hành vi giữa các bản three

human-atlas ghim three **0.159**, gọi `new RoomEnvironment()` không truyền
renderer → đèn phòng cường độ **5**. Từ r167 nhánh đó bị bỏ, luôn là **900** —
sáng gấp 180 lần, mô bị bợt màu (đo được: cơ trung bình `rgb(228,164,150)` thay
vì `rgb(199,125,111)`).

`src/lib/humanAtlas/roomEnvironment.ts` là **bản r159 đóng băng**.
**Đừng thay bằng import từ `three/examples/jsm` khi nâng cấp three.**

### #7 — Bộ đệm canvas phải bám `devicePixelRatio`

`ResizeObserver` chỉ phát thông báo trong bước dựng hình, và đổi tỉ lệ hiển thị
Windows không đổi kích thước CSS. `applySize()` gọi từ **4 nguồn**: observer,
sự kiện resize, hẹn giờ `[0,150,500,1200,2500]ms`, và mỗi 30 khung hình.
Nó cũng xoá `lastIsolate` để khung ngắm scene tính lại — bỏ dòng đó là quả tim
bé tí ở một góc.

### #8 — Tên mảnh KHÔNG khớp vị trí (gan)

Atlas đặt tên phân thuỳ gan là "Hepatovenous segment II…IX", xếp vào hệ
`venous` (nên tô xanh tĩnh mạch), và **nhãn La Mã lệch vị trí**: FJ2823 mang
tên "VIII" nhưng trọng tâm nằm sau-trên-phải → thật ra là VII. Hai mảnh
"VII" và "IX" là bản sao độ phân giải thấp của mảnh khác.
Với cấu trúc có quy ước vị trí (phân thuỳ, đốt, thuỳ…) phải **đo trọng tâm**
(`node scripts/atlas/survey.mjs <regex>`) rồi gán theo MÃ, không theo tên.

### #9 — Một mạch/tạng có 2–4 mảnh ở nhiều mức chi tiết

Thân tạng có 3 mã trùng khít (0,0mm), "Descending aorta" là bản thô phủ cả
ĐM chủ ngực + bụng, ĐM thận có "Right renal artery" trùng "Trunk of right
renal artery"… Để lại là z-fighting nhấp nháy và đếm sai số mảnh.
`survey.mjs --dup` bắt cặp trùng trọng tâm; cặp lệch vài mm phải đo khoảng
cách lưới (xem các script gen-scene-liver/aorta) rồi mới quyết `EXCLUDE`.

### #10 — Regex không neo kéo nhầm mảnh cùng đuôi tên

`/thoracic vertebra$/` bắt cả "Intervertebral disk of third thoracic
vertebra"; `/^middle phalanx of left/` bắt cả đốt ngón CHÂN; `/angular gyrus$/`
bắt cả "Branch of … artery to left angular gyrus". Luôn **neo `^…$`**, nêu
tên cụ thể, và giới hạn `system` khi tên mạch/cơ mượn tên cấu trúc chúng nuôi.
**Đọc bảng in ra của bộ sinh** — số mảnh mỗi nhóm lệch là thấy ngay.

### #11 — Kiểm "thiếu" bằng regex quá hẹp

Tra `trapezi` ra "trapezium" nên từng kết luận atlas thiếu xương thê — sai,
mảnh tên "Left trapezoid". Trước khi ghi "atlas thiếu X" vào note, tra bằng
MỌI tên đồng nghĩa và cả mảnh ở hệ khác.

### #12 — Lọc "bên trái" theo mép hộp bao là loại oan

Cơ mông lớn, cơ thang, cơ trám bám tới đường giữa nên mép hộp bao lấn sang
x < 0. `leftSide()` trong `lib.mjs` nay xét **tâm** hộp bao. Mắt thì ngược
lại — hai mắt sát nhau nên lọc theo chữ "left" trong tên.

### #13 — Lưới mắt PHẢI bị lẫn; atlas KHÔNG có thần kinh ngoại biên

Giác mạc, củng mạc, màng mạch phải có hộp bao rộng ~7cm (một nhãn cầu ~2,5cm)
→ scene mắt dùng mắt trái. Hệ `nervous` chỉ có não + 17 dây thần kinh hốc
mắt: không đám rối cánh tay, không thần kinh đùi/ngồi/giữa/trụ, không dây VI.
Bài nào xoay quanh dây thần kinh ngoại biên → **giữ Z-Anatomy**.

### #14 — Nhóm nền che chủ thể → `fadedGroups`

Ruột che cây mạch mạc treo, xương che mạch chi. Khai `faded: [...]` trong
`emit()` → scene sinh `fadedGroups`, viewer làm mờ sẵn lúc mở và khi Đặt lại.

### #15 — Atlas có lưới đặt tên SAI VÙNG — lọc tên + bên là không đủ

"Set of dorsal digital arteries" FJ2093 nằm ở cẳng chân (y=0,21); "Dorsal
metacarpal vein" FJ2186 và "Set of dorsal digital veins" FJ2185 nằm ở bàn
chân. Lần sinh đầu chúng lọt vào nhóm động mạch ngón TAY và mạng TM mu TAY.
Scene chi phải lọc thêm theo độ cao: `upperLimbY()` / `betweenY()` trong lib.

### #16 — Kiểm toán bắt buộc sau MỌI lần sinh: `node scripts/atlas/audit.mjs`

Đợt 2 đã giao 38 scene mà chưa chạy nó; lần chạy đầu bắt được 20 cặp trùng
và 17 mảnh lạc chỗ, trong đó có 7 lỗi thật (mảnh chân trong bài tay, bản sao
chưa loại, nhóm sai nội dung). Đọc TOÀN BỘ danh sách thành viên từng nhóm,
không chỉ số lượng. Cờ "TRUNG" giữa mạch đi kèm (ĐM–TM vành, ống mật–ĐM gan)
hay lớp lồng nhau (củng mạc–màng mạch) là đúng giải phẫu, không phải lỗi.

### #17 — Có nhóm mốc mờ sẵn thì PHẢI khai `frame`

Xương mờ vẫn tính vào khung ngắm: xương chậu làm phễu cơ đáy chậu còn một
chấm, TM chủ dưới 40cm làm quả thận còn một chấm, cơ thắt lưng che kín đốt
sống. Chụp từng scene SAU khi sinh, không chỉ lúc đầu.

### #18 — Tên "segmental artery/vein" dùng chung cho PHỔI, THẬN, GAN

"Anterior segmental artery" có ở cả phổi lẫn thận; "posterior segmental vein"
có ở phổi và gan. Lấy mạch phân thùy phổi phải lọc độ cao ngực (`betweenY`
1,15–1,50 — hằng `LUNG_Y` trong gen-scene-batch-e).

### #19 — Đuôi tên trùng xuyên hệ: "gastric" ⊂ "epigastric", "tendon" ⊂ tên cơ

`gastric artery$` không neo đầu bắt luôn "superior epigastric artery" (đã dính ở
bài thân tạng). Mọi regex tên mạch phải neo `^` và cho `(left |right )?`.

### #20 — Lưới trùng đã xác minh: khai MỘT lần trong `KNOWN_DUPLICATES` (lib.mjs)

`emit()` luôn loại các mã này ở mọi scene sinh lại. Thêm mã khi `audit.mjs` báo
cặp cùng tên lệch < 2mm (ĐM nền, xương móng, sụn nhẫn, thân tạng, ĐM mạc treo
tràng trên, cung gân cơ nâng hậu môn…). Cặp khác tên nằm sát nhau (động mạch
áp phế quản cùng tên, giác mạc–mống mắt) là liên quan thật — giữ.

### #21 — Scene tổng quan dễ bị lớp ngoài che kín

Bài "Giải phẫu thân mình" mở ra chỉ thấy khối cơ đỏ. Bài tổng quan theo lớp
phải làm mờ sẵn các lớp ngoài (`faded`) để lúc mở đã thấy tạng bên trong.

---

## 4. Quy ước giao diện đã chốt

- **Trang toàn thân** tràn viền, không header. **Trang chuyên đề** có header với
  nút thoát — người dùng vào từ thư viện nên cần lối ra.
- **Cột trái là một khối `flex` + `gap`**, không neo `top`/`bottom` từng tấm.
  Bề rộng là biến `--rail-w`.
- Tiêu đề bài **không nằm trong** cột thu gọn, và **không phải card**.
- Thanh tách rời: hai nút icon **cùng cỡ** hai bên, thanh trượt ở giữa (nếu để
  nút chữ một bên thì thanh trượt lệch 30px dù hộp căn giữa đúng).
- Thu gọn = **control nhìn ra là control**, không phải hộp rỗng trượt đi.
- Tiêu đề cấu trúc ở trang chuyên đề dùng `text-transform: none` (tiếng Việt).
- Chữ và viền chế độ sáng đã tăng tương phản so với bản gốc human-atlas
  (viền 9% → 20%).

---

## 5. Scene đã chuyển (11) và việc tiếp theo

| slug | bộ sinh | nhóm · mảnh | xử lý đặc biệt |
|---|---|---|---|
| `giai-phau-tim` | gen-scene-heart | 14 · 98 | scene mẫu |
| `giai-phau-gan` | gen-scene-liver | 13 · 77 | gán phân thuỳ theo trọng tâm (#8), bỏ 7 bản sao |
| `dai-nao` | gen-scene-brain | 16 · 109 | não thất lấy theo tên (#1), lọc bỏ mạch (#10) |
| `giai-phau-so` | gen-scene-skull | 13 · 51 | xương lệ/xoăn mũi xếp nhầm hệ, bỏ bản sao xương móng |
| `cot-song` | gen-scene-spine | 7 · 48 | **atlas không có xương cụt** |
| `long-nguc` | gen-scene-thorax | 6 · 53 | **chỉ có sụn sườn I–VII** |
| `dai-vai-chi-tren` | gen-scene-upper-limb | 7 · 32 | chỉ bên trái |
| `ban-tay` | gen-scene-hand | 6 · 27 | bàn tay trái |
| `ban-chan` | gen-scene-foot | 6 · 28 | bàn chân trái |
| `bo-rang` | gen-scene-teeth | 7 · 33 | 28 răng, **không có răng khôn** |
| `he-dong-mach-chu` | gen-scene-aorta | 10 · 62 | bỏ 11 bản sao (#9), **không có ĐM cảnh ngoài** |

**Đợt 2 (10/09/2026) — thêm 38 scene, tổng 49:**

| nhóm | slug (bộ sinh) | ghi chú thiếu dữ liệu |
|---|---|---|
| mạch | `da-giac-willis` (willis), `dong-mach-chi-tren` (arm-arteries), `dong-mach-chi-duoi` (leg-arteries), `he-tinh-mach-chu-cua` (caval-portal), `tinh-mach-hien` (leg-veins), `tinh-mach-chi-tren` (arm-veins), `dong-mach-vanh` (coronary), `mach-mac-treo` (mesenteric), `tim-day-du` (heart-full) | chi dưới thiếu thân ĐM đùi sâu, ĐM mác |
| tạng | `he-tiet-nieu` (urinary), `than-nieu-quan` (kidney), `he-sinh-san-nam` (male-repro), `co-quan-sinh-duc-nam` (male-genital), `bang-quang-tien-liet`, `tuy-lach` (pancreas-spleen), `tong-quan-he-tieu-hoa` (digestive), `da-day-ta-trang` (stomach), `ruot-non-ruot-gia` (bowel), `gan-duong-mat` (biliary), `khoang-sau-phuc-mac` (retroperitoneum), `thuc-quan` (oesophagus), `trung-that` (mediastinum), `mat-cat-ngang-bung` (abdomen-section) | không bể thận, không xích-ma, không mạc nối, không dây X |
| thần kinh – giác quan | `gian-nao-he-vien` (limbic), `duong-thi-giac` (visual), `giai-phau-mat` (eye), `hoc-mat` (orbit), `thanh-quan` (larynx) | mắt phải lỗi lưới; không dây VI |
| cơ – xương | `co-canh-tay` (arm-muscles), `co-dui-mong` (thigh-muscles), `vai-ho-nach` (shoulder), `dai-chau-chay` (iliotibial), `vung-mong` (gluteal), `chau-hong-day-chau` (pelvic-floor), `co-hoanh-day-du` (diaphragm), `cot-song-co` (cervical-spine), `cot-song-that-lung` (lumbar-spine) | không thần kinh ngoại biên, không dây chằng, không cơ lưng rộng / vuông thắt lưng |

**Đợt 3 (11/09/2026) — thêm 5 scene, tổng 54:** `giai-phau-cang-tay` (forearm),
`giai-phau-ban-tay` (hand-detail), `cang-chan-ban-chan` (leg), `co-vung-gay`
(nuchal), `giai-phau-co` (neck). Cốt lõi là cơ + mạch; thiếu thần kinh, dây chằng,
bao gân, tuyến giáp — ghi rõ trong intro từng bài. Lọc theo VỊ TRÍ, không theo
chữ bên trong tên: atlas có "Right flexor pollicis brevis" nằm ở tay trái.

Khung ngắm scene chuyên đề (11/09): căn ĐỐI XỨNG quanh tâm trang (thẳng trục thanh
Tách rời), chiếu 8 góc hộp bao để chỉnh khoảng cách; bỏ qua khi canvas w/h < 50px
(từng ra NaN → scene trống). Thẻ mặt cắt ở `/viewer` nằm cột trái dưới bảng hệ cơ quan.

Hai tính năng mới cho scene: `fadedGroups` (bẫy #14) và `clip` — mặt cắt
bật sẵn, `percent` tính theo hộp bao scene (xem gen-scene-abdomen-section).
Scene trùng nội dung thì DÙNG LẠI nhóm đã sinh (heart-full đọc heart.ts +
coronary.ts; male-genital đọc male-repro.ts) — chạy sau bộ sinh gốc.

**Đợt 4 (11/09/2026) — 67 scene còn lại, TỔNG 121/121 CHẠY ATLAS.** Không còn
bài nào lùi về Z-Anatomy (`node` kiểm: mọi slug trong `sceneModules` có scene
atlas, 0 mã FJ hỏng, tsc/eslint sạch). Bộ sinh gom theo đợt, mỗi file nhiều
`emit` (tham số `script` ghi đúng tên bộ sinh vào đầu file .ts):

| bộ sinh | vùng | slug |
|---|---|---|
| gen-scene-batch-a | chi trên | giai-phau-canh-tay, giai-phau-dai-vai, chop-xoay-vai, ho-khuyu, khop-khuyu, co-tay-ong-co-tay, khop-vai-khuyu*, dam-roi-canh-tay* |
| gen-scene-batch-b | chi dưới, chậu | khop-goi, ho-khoeo, khop-co-chan, gan-got-ong-co-chan, khop-hang, tam-giac-dui, ban-chan-chi-tiet, khop-cung-chau, vung-ben*, khop-hang-dui*, than-kinh-toa*, co-mat*, tuy-song-dam-roi*, ong-song-that-lung*, dam-roi-that-lung-cung* |
| gen-scene-batch-c | mạch não, não | tai-day-du*, khop-thai-duong-ham*, ho-duoi-thai-duong*, xoang-tinh-mach-mang-cung*, goc-cau-tieu-nao*, than-nao-day-so-full*, tieu-nao-day-du*, co-mat-than-kinh-vii*, hach-co* |
| gen-scene-batch-d | đầu, cổ, TKTW | giai-phau-dau, than-nao-day-so, tieu-nao, nao-that-mang-nao, so-nen-so, mui-xoang, mieng-luoi-rang, hau-thanh-quan, tuyen-nuoc-bot, tam-giac-co, dong-mach-canh, than-kinh-sinh-ba (V1), le-dao |
| gen-scene-batch-e | thân mình | giai-phau-than, he-noi-tiet, thanh-bung, vung-lung, thanh-nguc, khop-uc-don, cot-song-nguc, phoi-cay-phe-quan, giai-phau-phoi, tuyen-giap*, co-bung*, can-nguc-that-lung*, phuc-mac-mac-treo*, he-bach-huyet*, than-kinh-tu-chu*, vung-nguc-tuyen-vu*, mang-phoi* |
| gen-scene-batch-f | 6 slug sót | moc-xuong-chi-tren, moc-xuong-chi-duoi, mo-lien-ket, he-thinh-giac*, he-mac*, tuyen-noi-tiet* |

`*` = **ĐỔI CHỦ ĐỀ** vì atlas thiếu cấu trúc cốt lõi của bài cũ. Chủ đề mới
chọn trong phần atlas có dữ liệu mà thư viện chưa có bài: ĐM não trước/giữa/sau,
nhánh xuyên sâu, hệ đốt sống–thân nền, nhân nền, hồi vỏ não, thể chai và các
mép, cơ trên–dưới móng, vòng nối ĐM quanh vai/quanh gối, cung ĐM gan tay,
nhóm cơ khép, đùi sau, khoang cẳng chân trước–ngoài, bốn lớp cơ gan chân, cơ
thắt lưng–chậu, hệ TM chậu, tuyến thượng thận, cơ dựng sống, thân tạng, mạch
đại tràng, tuyến ức–lách, hệ TM đơn, cơ vùng ngực, mạch phổi phân thùy, cơ
trước cột sống cổ, vòng mạch tụy–tá tràng, lỗ trên lồng ngực. Bài GIỮ chủ đề
nhưng atlas thiếu một phần (dây chằng khớp, dây thần kinh, tuyến giáp, nhu mô
phổi) thì intro ghi rõ phần thiếu; bài khớp dạy "xương + cơ vận động + vòng
nối mạch".

**Thẻ thư viện đi theo scene atlas** (`catalog.ts` → `atlasCard`): slug có scene
atlas thì thẻ lấy `title`, `intro`, số nhóm, chữ tìm kiếm từ scene atlas, `system`
nếu scene khai (bài đổi chủ đề), và LUÔN dẫn `/giai-phau/mo-hinh/<slug>` — không
rẽ sang `/xem-*` hay `/xem/<slug>` nữa. Thumbnail bài đổi chủ đề chụp lại từ
scene atlas bằng `node scripts/atlas/thumb-atlas.mjs [slug…]` (Chrome headless +
SwiftShader, cần dev server :3000; không tham số = mọi scene có khai `system`).
Ảnh cũ lưu ở `public/thumbnails/_cu/`.

**Bài BỘ PHẬN học theo lớp (11/09/2026, `gen-scene-parts.mjs`)** — user chê bài
chuyên đề nhìn rối (quá nhiều dây/mạch cùng lúc), muốn học "kiểu một bộ phận"
như Complete Anatomy. Scene khai `layers: [{key,name,groups,on}]`; trang hiện
hàng nút lớp ở đầu cột trái, nhóm thuộc lớp tắt bị cộng vào `hidden`. Slug
`bo-phan-*`, không có SceneModule — `catalog.ts` tự thêm thẻ cho mọi scene chỉ
có trên atlas, route `generateStaticParams` gộp cả `atlasScenes`. 13 bài: gối,
vai, khuỷu, bàn tay, hông, cổ chân–bàn chân (viết tay) + tim, gan, não, nhãn
cầu, sọ, thanh quản, dạ dày (`groupsFrom(<scene chuyên đề>)` dùng lại nhóm và
ghi chú đã kiểm, chỉ chia lớp). Khung ngắm theo `frame` nay ÔM CẢ MẢNH ĐANG ẨN
để bật/tắt lớp không làm khung nhảy; nhãn chỉ dẫn kẹp điểm neo vào hộp khung.
Nút góc nhìn T/B/S giờ đổi hướng thật ở trang chuyên đề (trước cố định ¾).

Ảnh bìa: `node scripts/atlas/thumb-cdp.mjs [slug…|--missing]` — một Chrome dùng
lại qua DevTools Protocol, ~5 giây/bài (bản `thumb-atlas.mjs` mở Chrome
SwiftShader mỗi bài, ~3 phút/bài, chạy song song thì hết giờ hàng loạt).
Trang `?thumb[&view=back|front]` ẩn giao diện + nhóm mốc mờ.

**Kiểm lần cuối 12/09/2026 — 148 bài (121 chuyên đề + 27 bộ phận).**
- Dữ liệu: `node scripts/atlas/audit.mjs` — đủ 148, 0 mã hỏng, 0 nhóm rỗng, không
  còn bản trùng thật (cặp "oblique arytenoid" trái–phải là hai cơ thật bắt chéo).
  Bẫy: parser từng neo "groups" đầu tiên → bắt nhầm "groups" trong LỚP, dừng ở
  86/148. Nay neo "groups" cấp đầu (thụt 2 dấu cách) — cả `fromScene/groupsFrom`.
- Trang: `node scripts/atlas/audit-pages.mjs [slug…]` — Chrome thật, kiểm lỗi
  console, tải xong, canvas có hình, mặt cắt bật đúng khai báo, số mục = số nhóm,
  có nhãn, có nút lớp; lưu ảnh từng trang để soát bằng mắt. "CHAM MEP" phần lớn
  là mạch/niệu quản dài chạy ra khỏi khung — chấp nhận; phải XEM ẢNH mới biết.
- Lỗi thật đã sửa nhờ soát ảnh: mặt cắt ngang bụng nhìn ¾ (mặt cắt thành một vạch)
  → `view: "top"`; nền sọ chỉ thấy vòm → cắt ngang trên hố yên (`clip.atY`) + nhìn
  từ trên; mũi–xoang xương trán choán khung → căn theo mũi, trán mờ; thượng thận
  khung sát → căn cả thận; tiêu đề ≥3 dòng đè thẻ bài học → kẹp 2 dòng; nhãn chỉ
  vào nửa đã cắt → kéo điểm neo về mặt cắt; ĐM trùng màu cam với cơ ở 3 bài bộ phận.
- Scene mới có `view` (góc mở trang; `top`/`bottom` thêm cho lát cắt ngang, phía
  TRƯỚC cơ thể ở mép trên) và `clip.atY` (độ cao cắt tính bằng mét).

**(LỊCH SỬ — hết hiệu lực từ đợt 4) Giữ Z-Anatomy (72 scene) — lý do theo nhóm:**
- Thần kinh ngoại biên / đám rối (#13): `dam-roi-*`, `than-kinh-*`,
  `tam-giac-dui`, `ho-khuyu`, `giai-phau-canh-tay`, `giai-phau-cang-tay`,
  `giai-phau-dai-vai`, `cang-chan-ban-chan`, `tuy-song-dam-roi`, `goc-cau-tieu-nao`…
- Dây chằng, bao khớp, mạc, túi hoạt dịch: mọi `khop-*`, `he-mac`,
  `mo-lien-ket`, `can-nguc-that-lung`, `chop-xoay-vai`, `ong-song-that-lung`…
- Cơ mặt, cơ nhai, tai, mũi xoang: `co-mat*`, `ho-duoi-thai-duong`,
  `he-thinh-giac`, `tai-day-du`, `mui-xoang`, `mieng-luoi-rang`, `le-dao`…
- Không có tạng: phổi/màng phổi (`giai-phau-phoi`, `phoi-cay-phe-quan`,
  `mang-phoi`, `giai-phau-than`), tuyến giáp/cận giáp (`tuyen-giap`,
  `he-noi-tiet`, `tuyen-noi-tiet`), hạch (`he-bach-huyet`, `hach-co`), liềm
  đại não/màng cứng (`nao-that-mang-nao`, `xoang-tinh-mach-mang-cung`), tiểu
  não chỉ một khối (`tieu-nao*`), ĐM cảnh ngoài (`dong-mach-canh`).

Scene mới dùng `scripts/atlas/lib.mjs` (`byRe`, `leftSide`, `emit`) — chép
một file gen-scene gần nhất rồi sửa nhóm là đủ. `old-scene.mjs <slug>` in
nhãn scene cũ để đối chiếu.

**Phổi: GIỮ Z-Anatomy** (`giai-phau-phoi`, `phoi-cay-phe-quan`, `mang-phoi`).
"Phân thuỳ phế quản phổi" trong atlas là **cây phế quản phân thuỳ** — atlas
KHÔNG có nhu mô phổi, thuỳ phổi hay màng phổi. Có thể làm scene MỚI "Cây
phế quản phân thuỳ" (khí quản + 2 phế quản chính + ~20 cây phân thuỳ), nhưng
cần slug và mục thư viện mới, không thay được bài phổi.

Nên làm tiếp (atlas đủ dữ liệu theo khảo sát): `da-giac-willis`,
`dong-mach-chi-duoi`, `dong-mach-chi-tren`, `he-tinh-mach-chu-cua`,
`gian-nao-he-vien`, `duong-thi-giac`, `hoc-mat`, `giai-phau-mat`.

**Giữ nguyên Z-Anatomy** cho: `he-thinh-giac`, `tai-day-du`,
`ho-duoi-thai-truong`, `khop-thai-duong-ham`, `he-mac`, `mo-lien-ket`,
`tuy-song-dam-roi` — atlas thiếu hẳn các cấu trúc này.

---

## 6. Việc còn nợ

- **Bảng ánh xạ Z-Anatomy ↔ FMA cho 803 tên cấu trúc.** Chưa làm. Nó là nền
  móng để chuyển scene hàng loạt, và cũng là thứ nối lại **deep-link bệnh lý**
  đã mất khi `/viewer` đổi nguồn (`lesionMesh` 19/106 bệnh, cột `meshName`,
  hotspot `Kidney.l`…).
- `ModelScene` (Z-Anatomy) chưa có tính năng tách rời — nếu muốn hai khu đồng
  nhất thì phải bổ sung.
- `next build` chưa chạy lần nào trong đợt này (dev server chiếm `.next`).

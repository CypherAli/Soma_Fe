# Khảo sát: thay 122 mô hình chuyên đề bằng dữ liệu BodyParts3D?

Sinh tự động ngày 10/09/2026 bằng cách so tên cấu trúc trong `src/lib/scenes/*.ts`
với `public/human-atlas/atlas.json`. **Con số dưới đây là CẬN DƯỚI** — bộ so tên
tự động không bắt được từ đồng nghĩa, xem mục "Hạn chế".

| | số scene |
|---|---|
| khớp 100% | 9 |
| khớp 80–99% | 16 |
| khớp 40–79% | 63 |
| khớp dưới 40% | 33 |
| **tổng** | **121** (1310 nhãn) |

## Hạn chế của phép đo

Hai bộ dữ liệu đặt tên khác nhau cho cùng một cấu trúc, nên tỉ lệ thật CAO HƠN bảng trên:

| Z-Anatomy | BodyParts3D | kết quả máy |
|---|---|---|
| External abdominal oblique muscle | external oblique | báo thiếu (sai) |
| Atlas (C1) | atlas | báo thiếu (sai) |
| Adenohypophysis | pituitary gland | báo thiếu (sai) |
| Suprarenal gland | adrenal gland | báo thiếu (sai) |

=> Không thể tự động hoá. Phải dựng **bảng ánh xạ Z-Anatomy ↔ FMA** thủ công.
Bảng đó cũng chính là thứ nối lại được deep-link bệnh lý đã mất khi /viewer đổi nguồn.

## BodyParts3D GIÀU HƠN hẳn (nên chuyển)

Đã tra trực tiếp trong atlas.json:

- **Tim**: lá van hai lá / ba lá riêng từng lá, vòng xơ van, cơ nhú trước/sau/vách của thất phải, cơ nhú bên của thất trái (có cả hai đầu). Scene `giai-phau-tim` hiện tại chỉ có 4 khối tô màu.
- ~~**Phổi**: phân thuỳ phế quản phổi~~ — **ĐÍNH CHÍNH (10/09/2026):** đó là
  CÂY PHẾ QUẢN phân thuỳ ("… segmental bronchial tree"), không phải nhu mô.
  Atlas không có thuỳ phổi, nhu mô hay màng phổi → các bài phổi GIỮ Z-Anatomy.
- **Gan**: thuỳ đuôi, thuỳ phải/trái, ống mật từng thuỳ.
- **Não**: phân đoạn và thuỳ bán cầu đại não, đám rối mạch mạc, hành não.

## BodyParts3D THIẾU HẲN (phải giữ Z-Anatomy)

Tra bằng chuỗi con, không có kết quả nào:

- Xương con tai giữa và tai trong: malleus, incus, stapes, cochlea → scene `he-thinh-giac`, `tai-day-du`
- Cơ nhai: masseter, temporalis, pterygoid → `ho-duoi-thai-duong`, `khop-thai-duong-ham`
- Cơ mặt: orbicularis, frontalis
- Túi hoạt dịch (bursa), hạch bạch huyết có tên (hệ bạch huyết trong atlas chỉ có 3 mảnh)
- Mạc và cân (fascia, aponeurosis) → `he-mac`, `mo-lien-ket`
- Cấu trúc trong tuỷ sống (sừng trước/sau, chất trắng) → `tuy-song-dam-roi`

## Bảng đầy đủ 121 scene

| scene | nhãn | khớp | % | thiếu (5 đầu) |
|---|---|---|---|---|
| `hoc-mat` | 12 | 12 | 100% | — |
| `dong-mach-chi-duoi` | 12 | 12 | 100% | — |
| `co-canh-tay` | 9 | 9 | 100% | — |
| `giai-phau-so` | 9 | 9 | 100% | — |
| `giai-phau-mat` | 8 | 8 | 100% | — |
| `da-giac-willis` | 7 | 7 | 100% | — |
| `vai-ho-nach` | 7 | 7 | 100% | — |
| `co-dui-mong` | 6 | 6 | 100% | — |
| `dai-vai-chi-tren` | 5 | 5 | 100% | — |
| `mach-mac-treo` | 12 | 11 | 92% | Greater omentum |
| `dai-chau-chay` | 12 | 11 | 92% | Trochanteric bursa of gluteus maximus muscle.r |
| `he-tinh-mach-chu-cua` | 10 | 9 | 90% | Hepatic veins.001 |
| `tam-giac-co` | 9 | 8 | 89% | Vagus nerve (X).r.001 |
| `he-sinh-san-nam` | 9 | 8 | 89% | Ductus deferens.l |
| `he-tiet-nieu` | 7 | 6 | 86% | Renal pelvis.l |
| `hau-thanh-quan` | 12 | 10 | 83% | Nasopharynx, Oropharynx |
| `dong-mach-chi-tren` | 12 | 10 | 83% | Superficial palmar arch.r.001, Proper palmar digital arteries.r.001 |
| `tam-giac-dui` | 12 | 10 | 83% | Inguinal ligament.r, Lateral femoral cutaneous nerve.r.001 |
| `mat-cat-ngang-bung` | 6 | 5 | 83% | Vertebra T12 |
| `he-noi-tiet` | 6 | 5 | 83% | Adenohypophysis |
| `tuy-lach` | 6 | 5 | 83% | Coeliac trunk.001 |
| `co-quan-sinh-duc-nam` | 11 | 9 | 82% | Ductus deferens.r.001, Ejaculatory duct.r.001 |
| `tinh-mach-hien` | 11 | 9 | 82% | Posterior tibial veins.r.001, Genicular veins.r.001 |
| `giai-phau-canh-tay` | 16 | 13 | 81% | tube_Posterior cord of brachial plexus.r, Central axillary nodes.r, Skin envelope |
| `dai-nao` | 15 | 12 | 80% | Opercular part of inferior frontal gyrus.l, Lateral occipital gyrus (Middle occipital gyrus*).l, Falx cerebri |
| `tong-quan-he-tieu-hoa` | 9 | 7 | 78% | Posterior segment of liver (I), Vermiform appendix |
| `gian-nao-he-vien` | 9 | 7 | 78% | Mamillary body.l, Amygdaloid body.l |
| `khop-khuyu` | 9 | 7 | 78% | Annular ligament of radius.r, Articular capsule of elbow joint.r |
| `thanh-quan` | 9 | 7 | 78% | External part of thyro-arytenoid muscle.l, Ary-epiglottic part of oblique arytenoid muscle.l |
| `ban-chan` | 9 | 7 | 78% | Proximal phalanx of first finger of foot.l, Distal phalanx of first finger of foot.l |
| `tim-day-du` | 12 | 9 | 75% | Posterior leaflet of left atrioventricular valve, Septal leaflet of right atrioventricular valve, Right coronary leaflet |
| `co-vung-gay` | 12 | 9 | 75% | Semispinalis colli muscle.r, Multifidus colli muscle.r, Ligamenta flava |
| `ho-khuyu` | 12 | 9 | 75% | Superficial head of pronator teres.r, Posterior interosseous nerve of forearm.r.001, Annular ligament of radius.r |
| `duong-thi-giac` | 12 | 9 | 75% | Calcarine sulcus.r, Occipital pole.r, Cuneus.r |
| `bang-quang-tien-liet` | 12 | 9 | 75% | Ductus deferens.r.001, Ejaculatory duct.r.001, Pubic symphysis |
| `giai-phau-dai-vai` | 38 | 28 | 74% | Sternocostal head of pectoralis major muscle.r, Latissimus dorsi muscle.r, Roots of brachial plexus.r.001, Superior trunk of brachial plexus.r.001, Posterior cord of brachial plexus.r.001 |
| `giai-phau-co` | 15 | 11 | 73% | Anterior belly of digastric muscle.r, Vertebra C5, Vagus nerve (X).l.001, Inferior deep lateral cervical nodes.r |
| `le-dao` | 11 | 8 | 73% | Ampulla of lacrimal canaliculus.r, Mucosa of nasal cavity, Palpebral part of orbicularis oculi.r |
| `da-day-ta-trang` | 7 | 5 | 71% | Lesser omentum, Coeliac trunk.001 |
| `chau-hong-day-chau` | 7 | 5 | 71% | Sacrotuberous ligament.r, Interosseous sacro-iliac ligament.r |
| `co-tay-ong-co-tay` | 10 | 7 | 70% | Scapholunate interosseous ligament.r, Articular disc of distal radio-ulnar joint.r, Superficial palmar arch.r.001 |
| `ban-tay` | 10 | 7 | 70% | Proximal phalanx of first finger of hand.l, Distal phalanx of third finger of hand.l, Distal phalanx of first finger of hand.l |
| `so-nen-so` | 13 | 9 | 69% | Facial nerve (VII).r.001, Vestibulocochlear nerve (VIII).r.001, Hypoglossal nerve (XII).r.001, Middle meningeal artery.r.001 |
| `he-dong-mach-chu` | 13 | 9 | 69% | Aortic arch.001, Brachiocephalic trunk.001, Coeliac trunk.001, Anterior branch of renal artery.r.001 |
| `giai-phau-than` | 15 | 10 | 67% | Sternocostal head of pectoralis major muscle.r, Rectus abdominis muscle.r, External abdominal oblique muscle.r, Superior lobe of right lung, Intercostal nerves.r.001 |
| `ban-chan-chi-tiet` | 15 | 10 | 67% | Plantar aponeurosis.r, Calcaneonavicular ligament.r, Quadratus plantae muscle.r, Sesamoid bones of foot.r, Deep transverse metatarsal ligament.r |
| `tinh-mach-chi-tren` | 12 | 8 | 67% | Brachial veins.r.001, Radial veins.r.001, Palmar digital veins.r.001, Dorsal digital veins of hand.r.001 |
| `than-kinh-toa` | 12 | 8 | 67% | Sciatic nerve.r.001, Common fibular nerve.r.001, Posterior femoral cutaneous nerve.r.001, Sciatic bursa of gluteus maximus muscle.r |
| `dong-mach-vanh` | 9 | 6 | 67% | Septal branches of anterior interventricular artery, Right inferolateral branch of right coronary artery, Inferior vein of left ventricle |
| `tuyen-noi-tiet` | 9 | 6 | 67% | Adenohypophysis, Neurohypophysis, Superior parathyroid gland.r |
| `ho-khoeo` | 9 | 6 | 67% | Common fibular nerve.r.001, Oblique popliteal ligament.r, Arcuate popliteal ligament.r |
| `khoang-sau-phuc-mac` | 9 | 6 | 67% | Renal pelvis.r, Quadratus lumborum muscle.r, Vertebra L1 |
| `long-nguc` | 9 | 6 | 67% | Manubrium of sternum, Costal cartilage of first rib.l, Costal cartilage of seventh rib.l |
| `tuyen-giap` | 11 | 7 | 64% | Superior parathyroid gland.r, Inferior parathyroid gland.r, Superior thyroid vein.r.001, Vagus nerve (X).r.001 |
| `thuc-quan` | 11 | 7 | 64% | Oesophagus.001, Vagus nerve (X).l.001, Juxta-oesophageal nodes, Inferior tracheobronchial nodes |
| `giai-phau-cang-tay` | 32 | 20 | 63% | Distal phalanx of first finger of hand.r, Humero-ulnar head of flexor digitorum superficialis.r, Dorsal interossei muscles of hand.r, Lumbrical muscles of hand.r, Palmar aponeurosis.r |
| `giai-phau-tim` | 8 | 5 | 63% | Posterior leaflet of left atrioventricular valve, Septal leaflet of right atrioventricular valve, Anterior semilunar leaflet of pulmonary valve |
| `gan-duong-mat` | 8 | 5 | 63% | Posterior segment of liver (I), Left medial segment of liver (IV), Posterior lateral segment of liver (VII) |
| `ruot-non-ruot-gia` | 8 | 5 | 63% | Sigmoid colon, Vermiform appendix, Free taenia |
| `co-hoanh-day-du` | 10 | 6 | 60% | Diaphragmatic fascia, External intercostal muscles.r, Internal intercostal muscles.r, Quadratus lumborum muscle.r |
| `trung-that` | 10 | 6 | 60% | Oesophagus.001, Aortic arch.001, Vagus nerve (X).r.001, Sympathetic trunk.r.001 |
| `nao-that-mang-nao` | 10 | 6 | 60% | Septum pellucidum, Aqueduct of midbrain, Falx cerebri, Spinal dura |
| `vung-mong` | 10 | 6 | 60% | Superior gemellus muscle.r, Sciatic nerve.r.001, Sacrotuberous ligament.r, Ligament of head of femur.r |
| `cang-chan-ban-chan` | 12 | 7 | 58% | Deep fibular nerve.r.001, Anterior talofibular ligament.r, Plantar calcaneonavicular ligament.r, Plantar aponeurosis.r, Flexor retinaculum of ankle.r |
| `dam-roi-that-lung-cung` | 12 | 7 | 58% | Lateral femoral cutaneous nerve.r.001, Genitofemoral nerve.r.001, Iliohypogastric nerve.r.001, Sciatic nerve.r.001, Common fibular nerve.r.001 |
| `dong-mach-canh` | 12 | 7 | 58% | External carotid artery.r.001, Facial artery.r.001, Superficial temporal artery.r.001, Vagus nerve (X).r.001, Hypoglossal nerve (XII).r.001 |
| `chop-xoay-vai` | 12 | 7 | 58% | Glenoid labrum.r, Articular capsule of glenohumeral joint.r, Subacromial bursa.r, Coraco-acromial ligament.r, Transverse humeral ligament.r |
| `giai-phau-dau` | 14 | 8 | 57% | Superficial part of masseter.r, Temporalis muscle.r, Facial artery.r.001, Superficial temporal artery.r.001, Facial vein.r.001 |
| `thanh-nguc` | 7 | 4 | 57% | External intercostal muscles.r, Internal intercostal muscles.r, Intercostal nerves.r.001 |
| `phuc-mac-mac-treo` | 9 | 5 | 56% | Greater omentum, Lesser omentum, Meso-appendix, Free taenia |
| `khop-co-chan` | 9 | 5 | 56% | Anterior talofibular ligament.r, Calcaneofibular ligament.r, Flexor retinaculum of ankle.r, Inferior extensor retinaculum of ankle.r |
| `khop-hang-dui` | 13 | 7 | 54% | Articular capsule of hip joint.r, Acetabular labrum.r, Descending part of iliofemoral ligament.r, Ligament of head of femur.r, Sciatic nerve.r.001 |
| `moc-xuong-chi-tren` | 13 | 7 | 54% | Deltoid muscle.er, Infraspinatus muscle.er, Pectoralis major muscle.er, Latissimus dorsi muscle.er, Biceps brachii muscle.er |
| `moc-xuong-chi-duoi` | 13 | 7 | 54% | Gluteus maximus muscle.er, Gluteus medius muscle.er, Iliopsoas muscle.er, Adductor magnus.er, Quadriceps femoris muscle.er |
| `than-nao-day-so` | 18 | 9 | 50% | Red nucleus.l, Olive.l, Olfactory nerve (I).l, Abducens nerve (VI).l, Facial nerve (VII).l |
| `khop-uc-don` | 12 | 6 | 50% | Articular disc of sternoclavicular joint.r, Anterior sternoclavicular ligament.r, Posterior sternoclavicular ligament.r, Costoclavicular ligament.r, Interclavicular ligament.r |
| `mui-xoang` | 10 | 5 | 50% | Nasal septal cartilage, Anterior cells of ethmoid bone.r, Mucosa of nasal cavity, Nasopharynx, Posterior septal branches of sphenopalatine artery.r.001 |
| `than-nieu-quan` | 6 | 3 | 50% | Renal pelvis.r, Anterior branch of renal artery.r.001, Intrarenal veins of left kidney.001 |
| `cot-song-co` | 6 | 3 | 50% | Intervertebral disc C5-C6, Ligamenta flava, Vertebra C5 |
| `dam-roi-canh-tay` | 13 | 6 | 46% | Roots of brachial plexus.r.001, Superior trunk of brachial plexus.r.001, Middle trunk of brachial plexus.r.001, Inferior trunk of brachial plexus.r.001, Posterior cord of brachial plexus.r.001 |
| `gan-got-ong-co-chan` | 13 | 6 | 46% | Flexor retinaculum of ankle.r, Anterior talofibular ligament.r, Calcaneofibular ligament.r, Tibiocalcaneal ligament.r, Plantar aponeurosis.r |
| `giai-phau-ban-tay` | 40 | 18 | 45% | Extensor retinaculum of wrist.r, Common flexor tendon sheath.r, Cruciform part of fibrous sheath of digit of hand.r, Dorsal interossei muscles of hand.r, Lumbrical muscles of hand.r |
| `mieng-luoi-rang` | 11 | 5 | 45% | Deep part of masseter.r, Medial pterygoid muscle.r, Parotid gland.r, Upper first molar tooth.r, Lower medial incisor.r |
| `khop-hang` | 16 | 7 | 44% | Acetabular labrum.r, Transverse acetabular ligament.r, Ligament of head of femur.r, Articular capsule of hip joint.r, Descending part of iliofemoral ligament.r |
| `vung-lung` | 7 | 3 | 43% | Latissimus dorsi muscle.r, Multifidus lumborum muscle.r, Posterior layer of thoracolumbar fascia.r, Long thoracic nerve.r.001 |
| `cot-song` | 7 | 3 | 43% | Vertebra C7, Vertebra T6, Vertebra L3, Coccyx |
| `goc-cau-tieu-nao` | 12 | 5 | 42% | Vestibulocochlear nerve (VIII).r.001, Facial nerve (VII).r.001, Glossopharyngeal nerve (IX).r.001, Abducens nerve (VI).r.001, Cochlea.r |
| `phoi-cay-phe-quan` | 10 | 4 | 40% | Superior lobe of right lung, Middle lobe of right lung, Superior lobe of left lung, Pleura, Inferior tracheobronchial nodes |
| `than-nao-day-so-full` | 11 | 4 | 36% | Nucleus ambiguus.l, Motor nucleus of facial nerve.l, Accessory nucleus of oculomotor nerve.l, Nucleus of hypoglossal nerve.l, Anterior cochlear nucleus.l |
| `mang-phoi` | 11 | 4 | 36% | Pleura, Superior lobe of right lung, Middle lobe of right lung, Inferior lobe of left lung, External intercostal muscles.r |
| `vung-nguc-tuyen-vu` | 12 | 4 | 33% | Mammary region.r, Inframammary region.r, Sternocostal head of pectoralis major muscle.r, Lateral axillary nodes.r, Apical axillary nodes.r |
| `than-kinh-sinh-ba` | 12 | 4 | 33% | Sensory root of trigeminal nerve.r, Motor root of trigeminal nerve.r, Anterior division of mandibular nerve.r.001, Posterior division of mandibular nerve.r.001, Inferior alveolar nerve.r.001 |
| `co-mat` | 6 | 2 | 33% | Frontalis muscle.l, Orbital part of orbicularis oculi.l, Orbicularis oris muscle.l, Zygomaticus major muscle.l |
| `thanh-bung` | 10 | 3 | 30% | Rectus abdominis muscle.r, External abdominal oblique muscle.r, Internal abdominal oblique muscle.r, Transversus abdominis muscle.r, Pyramidalis muscle.r |
| `vung-ben` | 7 | 2 | 29% | External abdominal oblique muscle.r, Transversus abdominis muscle.r, Inguinal ligament.r, Ilio-inguinal nerve.r.001, Genital branch of genitofemoral nerve.r.001 |
| `hach-co` | 11 | 3 | 27% | Submental nodes.r, Superficial parotid nodes.r, Lateral superior jugular node.r, Anterior inferior jugular nodes.r, Supraclavicular nodes.r |
| `khop-goi` | 12 | 3 | 25% | Anterior cruciate ligament.r, Posterior cruciate ligament.r, Medial meniscus.r, Lateral meniscus.r, Superficial part of tibial collateral ligament.r |
| `can-nguc-that-lung` | 12 | 3 | 25% | Posterior layer of thoracolumbar fascia.r, Middle layer of thoracolumbar fascia.r, Anterior layer of thoracolumbar fascia.r, Multifidus lumborum muscle.r, Quadratus lumborum muscle.r |
| `tieu-nao-day-du` | 8 | 2 | 25% | Folium of vermis, Tonsil of cerebellum.l, Flocculus.l, Nodule of vermis, Superior cerebellar peduncle.l |
| `he-bach-huyet` | 9 | 2 | 22% | Palatine tonsil.r, Central axillary nodes.r, Inferior deep lateral cervical nodes.r, Juxta-intestinal mesenteric nodes, Intermediate lumbar nodes |
| `tuyen-nuoc-bot` | 9 | 2 | 22% | Parotid gland.r, Facial nerve (VII).r.001, Parotid duct.r.001, Submandibular duct.r.001, Retromandibular vein.r.001 |
| `bo-rang` | 9 | 2 | 22% | Upper medial incisor.l, Upper canine.l, Upper first premolar.l, Upper first molar tooth.l, Lower medial incisor.l |
| `khop-vai-khuyu` | 14 | 3 | 21% | Articular capsule of glenohumeral joint.r, Glenoid labrum.r, Superior glenohumeral ligament.r, Middle glenohumeral ligament.r, Inferior glenohumeral ligament.r |
| `cot-song-nguc` | 14 | 3 | 21% | Vertebra T6, Vertebra T12, Intervertebral disc T8-T9, Radiate ligament of head of rib.r, Costotransverse ligament.r |
| `than-kinh-tu-chu` | 10 | 2 | 20% | Sympathetic trunk.r.001, Ganglia of sympathetic trunk.r, Sympathetic nerves.r.001, Vagus nerve (X).r.001, Vagus nerve (X).l.001 |
| `khop-cung-chau` | 12 | 2 | 17% | Interosseous sacro-iliac ligament.r, Posterior sacro-iliac ligament.r, Anterior sacro-iliac ligament.r, Sacrotuberous ligament.r, Sacrospinous ligament.r |
| `giai-phau-phoi` | 6 | 1 | 17% | Superior lobe of right lung, Middle lobe of right lung, Inferior lobe of right lung, Superior lobe of left lung, Inferior lobe of left lung |
| `co-mat-than-kinh-vii` | 7 | 1 | 14% | Facial nerve (VII).r.001, Palpebral part of orbicularis oculi.r, Orbicularis oris muscle.r, Zygomaticus major muscle.r, Frontalis muscle.r |
| `cot-song-that-lung` | 7 | 1 | 14% | Intervertebral disc L4-L5, Nucleus pulposus L4-L5, Cauda equina.001, Anterior longitudinal ligament, Supraspinous ligament |
| `he-mac` | 8 | 1 | 13% | Posterior layer of thoracolumbar fascia.l, Crural fascia.l, Transversalis fascia, Clavipectoral fascia.l, Antebrachial fascia.l |
| `mo-lien-ket` | 8 | 1 | 13% | Epicranial aponeurosis.l, Palmar aponeurosis.l, Plantar aponeurosis.l, Superior extensor retinaculum of ankle.l, Anserine bursa.l |
| `giai-phau-gan` | 9 | 1 | 11% | Posterior segment of liver (I), Left posterior lateral segment of liver (II), Left anterior lateral segment of liver (III), Left medial segment of liver (IV), Anterior medial segment of liver (V) |
| `tai-day-du` | 10 | 1 | 10% | Tympanic membrane.r, Malleus.r, Incus.r, Stapes.r, Cochlea.r |
| `tuy-song-dam-roi` | 10 | 1 | 10% | Anterior horn of spinal cord, Posterior horn of spinal cord, White matter of spinal cord, Spinal ganglion.r, Spinal dura |
| `ho-duoi-thai-duong` | 12 | 1 | 8% | Superior head of lateral pterygoid muscle.r, Inferior head of lateral pterygoid muscle.r, Medial pterygoid muscle.r, Temporalis muscle.r, Middle meningeal artery.r.001 |
| `ong-song-that-lung` | 12 | 1 | 8% | Spinal dura, Cauda equina.001, Ligamenta flava, Interspinous ligaments, Supraspinous ligament |
| `he-thinh-giac` | 9 | 0 | 0% | Tympanic membrane.l, Malleus.l, Incus.l, Stapes.l, Cochlea.l |
| `xoang-tinh-mach-mang-cung` | 9 | 0 | 0% | Superior sagittal sinus.001, Inferior sagittal sinus.001, Straight sinus.001, Transverse sinus.r.001, Sigmoid sinus.r.001 |
| `tieu-nao` | 8 | 0 | 0% | Culmen, Declive, Nodule of vermis, Flocculus.l, Tonsil of cerebellum.l |
| `khop-thai-duong-ham` | 7 | 0 | 0% | Articular disc of temporomandibular joint.r, Articular capsule of temporomandibular joint.r, Lateral temporomandibular ligament.r, Superficial part of masseter.r, Temporalis muscle.r |
| `co-bung` | 5 | 0 | 0% | Rectus abdominis muscle.l, External abdominal oblique muscle.l, Internal abdominal oblique muscle.l, Transversus abdominis muscle.l, Pyramidalis muscle.l |

// Chữ giao diện của studio 3D — một chỗ duy nhất để đổi ngôn ngữ.
//
// index.html viết sẵn tiếng Việt (bản gốc), app.js đổi sang tiếng Anh khi
// iframe được mở với `?lang=en`. Mọi cặp chữ ở đây giữ đúng thứ tự [vi, en].

const T = (vi, en) => [vi, en];

/** [selector, [vi, en], thuộc-tính?] — thiếu thuộc tính thì đặt textContent. */
export const STATIC = [
  ['.brand-name', T('Atlas tương tác', 'Interactive atlas')],
  ['.brand-sub', T('Kéo để xoay · Cuộn để thu phóng · Hai tay để điều khiển', 'Drag to orbit · Scroll to zoom · Two hands to control')],
  ['#bPanel', T('Thu gọn bảng điều khiển', 'Collapse the panel'), 'title'],
  ['#cat', T('Giải phẫu học', 'Anatomy')],
  ['#name', T('Đang tải mô hình…', 'Loading model…')],
  ['label[for="modelGroup"]', T('Vùng giải phẫu', 'Body region')],
  ['label[for="modelSelect"]', T('Mô hình', 'Model')],
  ['#splitParts', T('Tách từng cấu trúc', 'Split into structures')],
  ['#splitHint', T('Tách riêng các mảnh nguồn · nắm tay để lắp lại', 'Separate source pieces · make a fist to reassemble')],
  ['#bNextBlock', T('Hệ tiếp · tay phải', 'Next system · right thumb')],
  ['#bNextBlock', T('Like bằng tay phải', 'Right thumb up'), 'title'],
  ['#blockCycleStatus', T('Like trái: mô hình tiếp · like phải: hệ tiếp', 'Left thumb: next model · right thumb: next system')],
  ['#viewStructures', T('Xem danh sách cấu trúc', 'Browse structures')],
  ['label[for="renderQuality"]', T('Chất lượng hiển thị', 'Render quality')],
  ['#stateKey', T('Trạng thái', 'State')],
  ['#poseKey', T('Bàn tay', 'Hand')],
  ['#openKey', T('Độ mở bàn tay', 'Hand openness')],
  ['#statePill', T('chờ', 'idle')],
  ['#posePill', T('chưa thấy tay', 'no hand')],
  ['label[for="separationMode"]', T('Cách tách mô hình', 'Explode mode')],
  ['label[for="selectionScope"]', T('Phạm vi trỏ/chọn', 'Point / select scope')],
  ['#separationLabel', T('Tách toàn mô hình', 'Explode the whole model')],
  ['#separationHint', T('Mở tay để tách các hệ · nắm tay để lắp lại', 'Open your hand to separate systems · fist to reassemble')],
  ['#explodeSlider', T('Mức tách lớp', 'Explode amount'), 'aria-label'],
  ['#layersTitle', T('Các lớp giải phẫu', 'Anatomy layers')],
  ['label[for="inspectionView"]', T('Chế độ quan sát', 'Inspection mode')],
  ['#showCoverLabel', T('Hiện bề mặt cơ thể', 'Show the body surface')],
  ['label[for="structureSearch"]', T('Tìm cấu trúc', 'Find a structure')],
  ['#structureSearch', T('Tên Việt, tên gốc hoặc mã FJ', 'Vietnamese name, source name or FJ code'), 'placeholder'],
  ['label[for="systemFocus"]', T('Chọn cấu trúc', 'Select a structure')],
  ['#layersHint', T('Chọn chế độ để mở từng hệ; chọn cấu trúc để xem riêng.', 'Pick a mode to open one system; select a structure to isolate it.')],
  ['.gesture-help > summary', T('Hướng dẫn cử chỉ', 'Gesture guide')],
  ['#structureListPanel > summary', T('Danh sách cấu trúc', 'Structure list')],
  ['#structureListHint', T('Chọn tên để căn giữa và xem riêng cấu trúc. Ô tìm kiếm phía trên tra cả tên Việt và tên nguồn.', 'Pick a name to center and isolate it. The search box above matches both Vietnamese and source names.')],
  ['#bSnap', T('Búng tay', 'Snap')],
  ['#bForm', T('Nắm tay', 'Fist')],
  ['#bOpen', T('Mở tay', 'Open')],
  ['#bNext', T('Mô hình tiếp', 'Next model')],
  ['#quizStop', T('Dừng luyện tập (Q)', 'Stop the quiz (Q)'), 'title'],
  ['#cameraPreview', T('Camera và quét giải phẫu', 'Camera and anatomy scan'), 'aria-label'],
  ['#cameraStatus', T('Camera đang tắt', 'Camera off')],
  ['#cameraCanvas', T('Camera nhận diện bàn tay', 'Hand-tracking camera'), 'aria-label'],
  ['#scanProgress', T('Tiến trình quét', 'Scan progress'), 'aria-label'],
  ['#scanResults', T('Kết quả quét', 'Scan results'), 'aria-label'],
  ['#scanCamera', T('Bật camera để quét', 'Start the camera to scan')],
  ['#scanCancel', T('Hủy quét', 'Cancel scan')],
  ['#cameraHint', T('Giữ bàn tay trong khung hình', 'Keep your hand in the frame')],
  ['#voicePanel > summary', T('Điều khiển giọng nói', 'Voice control')],
  ['label[for="voiceLanguage"]', T('Ngôn ngữ giọng nói', 'Speech language')],
  ['label[for="readDetail"]', T('Nội dung đọc', 'Reading content')],
  ['#autoReadLabel', T('Tự đọc khi chọn', 'Read on select')],
  ['#readSelected', T('Đọc', 'Read')],
  ['#stopReading', T('Dừng', 'Stop')],
  ['#micStatus', T('Micro đang tắt', 'Microphone off')],
  ['#speakerStatus', T('Loa đang nghỉ', 'Speaker idle')],
  ['label[for="voiceText"]', T('Lệnh văn bản', 'Text command')],
  ['#voiceText', T('Tách lớp, mở cổ tay…', 'Explode, open the wrist…'), 'placeholder'],
  ['#voiceSend', T('Thực hiện', 'Run')],
  ['#voiceExamples', T('“Tách lớp”, “mở cổ tay”, “chọn cơ cánh tay-quay”, “quét”, “đọc chú thích”.', '“Explode”, “open the wrist”, “select the brachioradialis”, “scan”, “read the description”.')],
  ['.voice-privacy', T('Nhận dạng giọng nói dùng dịch vụ của trình duyệt, có thể cần mạng.', 'Speech recognition uses the browser service and may need a network connection.')],
  ['#partClose', T('Đóng (Esc)', 'Close (Esc)'), 'title'],
  ['#partSystem', T('Xem riêng hệ này', 'Isolate this system')],
  ['#partPull', T('Kéo ra', 'Pull out')],
  ['#partSpeak', T('Đọc to', 'Read aloud')],
  ['#partCard .phint', T('Nắm rồi xòe tay để tách phần đã chọn · nắm lại để lắp · Esc để bỏ chọn', 'Fist then open your hand to separate the selection · fist again to reassemble · Esc to clear')],
  ['#help h2', T('Điều khiển mô hình', 'Model controls')],
  ['#viewFront', T('Trước', 'Front')],
  ['#viewBack', T('Sau', 'Back')],
  ['#viewSide', T('Bên', 'Side')],
  ['#viewReset', T('Đặt lại', 'Reset')],
  ['.view-presets', T('Góc nhìn mô hình', 'Model view'), 'aria-label'],
  ['#structurePager', T('Các nhóm cấu trúc', 'Structure groups'), 'aria-label'],
  ['#structuresPrevious', T('Nhóm cấu trúc trước', 'Previous structure group'), 'aria-label'],
  ['#structuresNext', T('Nhóm cấu trúc tiếp', 'Next structure group'), 'aria-label'],
  ['#labelPager', T('Các nhóm chú thích', 'Label groups'), 'aria-label'],
  ['#labelsPrevious', T('Nhóm chú thích trước', 'Previous label group'), 'aria-label'],
  ['#labelsNext', T('Nhóm chú thích tiếp', 'Next label group'), 'aria-label'],
  ['#bStartCam', T('Bật camera để bắt đầu', 'Start the camera')],
  ['#bStartNoCam', T('Dùng không cần camera', 'Continue without a camera')],
  ['.start-card h1', T('Cơ thể người 3D', 'The human body in 3D')],
  ['.start-card > p', T('Mô hình giải phẫu tương tác gồm não, tim, phổi, mắt, tai, răng, sọ, xương, gan, dạ dày, ruột, tụy và hệ cơ — điều khiển trực tiếp bằng bàn tay trước webcam.', 'An interactive anatomy set — brain, heart, lungs, eye, ear, teeth, skull, skeleton, liver, stomach, gut, pancreas and muscles — controlled directly by your hand in front of the webcam.')],
];

/** Các <select> dựng sẵn trong HTML: [value, vi, en]. */
const OPTIONS = {
  renderQuality: [['auto', 'Tự động', 'Auto'], ['smooth', 'Mượt', 'Smooth'], ['detail', 'Chi tiết', 'Detail']],
  separationMode: [['systems', 'Tách các hệ', 'Separate systems'], ['muscles', 'Tách từng cơ', 'Separate muscles'], ['selected', 'Tách cấu trúc trong khối', 'Separate the structures in the block']],
  selectionScope: [['group', 'Khối giải phẫu', 'Anatomical block'], ['part', 'Từng cấu trúc', 'Individual structures']],
  voiceLanguage: [['vi', 'Tiếng Việt', 'Vietnamese'], ['en', 'Tiếng Anh', 'English']],
  inspectionView: [['all', 'Tổng quan', 'Overview']],
  readDetail: [['name', 'Tên', 'Name'], ['description', 'Tên và mô tả', 'Name and description'], ['group', 'Kèm ghi chú nhóm', 'Include group notes']],
};

/** Năm bước ở màn hình bắt đầu. */
const START_STEPS = [
  ['🫰', T('<b>Búng tay</b> để gọi các hạt, búng lần nữa để làm tan.', '<b>Snap</b> to summon the particles, snap again to dissolve them.')],
  ['✊', T('<b>Nắm tay</b> để tạo hình cơ quan, <b>mở tay</b> để bóc tách từng lớp.', '<b>Fist</b> to form the organ, <b>open</b> your hand to peel the layers apart.')],
  ['🔄', T('<b>Nghiêng cổ tay</b> để xoay ngang, <b>nâng / hạ bàn tay</b> để xem trên / dưới. Hai tay dang ra / chụm vào để thu phóng. Có thể <b>kéo chuột để xoay, cuộn để thu phóng</b>.', '<b>Twist your wrist</b> to turn the model, <b>raise / lower your hand</b> to tilt it. Pull both hands apart or together to zoom. You can also <b>drag with the mouse to orbit and scroll to zoom</b>.')],
  ['☝️', T('<b>Trỏ và giữ</b> để chọn khối hoặc cấu trúc; <b>xòe/nắm</b> tách từng mảnh của khối đó–lắp lại.', '<b>Point and hold</b> to select a block or structure; <b>open/fist</b> to separate its pieces and reassemble them.')],
  ['👍', T('<b>Like tay trái</b>: mô hình tiếp. <b>Like tay phải</b>: hệ tiếp trong mô hình. Hạ ngón cái rồi giơ lại để chuyển tiếp.', '<b>Left thumb up</b>: next model. <b>Right thumb up</b>: next system in the model. Lower your thumb and raise it again to take the next step.')],
];

/** Bảng phím tắt trong hộp trợ giúp. */
const HELP_ROWS = [
  ['<kbd>Space</kbd>', T('Búng tay — gọi hạt / làm tan', 'Snap — summon / dissolve the particles')],
  ['<kbd>F</kbd> / <kbd>O</kbd>', T('Nắm tay (lắp lại) / mở tay (tách lớp)', 'Fist (reassemble) / open (explode)')],
  ['<kbd>V</kbd> <kbd>→</kbd> <kbd>←</kbd>', T('Mô hình tiếp / trước', 'Next / previous model')],
  ['<kbd>E</kbd> <kbd>↑</kbd> <kbd>↓</kbd> Shift + cuộn', T('Tách / lắp các lớp giải phẫu', 'Explode / reassemble the anatomy layers')],
  ['Xoay cổ tay', T('Xoay mô hình trái/phải · <kbd>G</kbd> bật/tắt', 'Turn the model left/right · <kbd>G</kbd> toggles hand rotation')],
  ['☝ Trỏ · 🤏 Véo', T('Chọn cấu trúc (hoặc bấm chọn) · kéo ra', 'Select a structure (or click it) · pull it out')],
  ['🙌 Hai tay · cuộn chuột', T('Thu phóng (hoặc <kbd>+</kbd> <kbd>-</kbd> <kbd>0</kbd>)', 'Zoom (or <kbd>+</kbd> <kbd>-</kbd> <kbd>0</kbd>)')],
  ['<kbd>X</kbd> <kbd>,</kbd> <kbd>.</kbd>', T('Mặt cắt (di chuyển tay / chuột)', 'Cross-section (move your hand / the mouse)')],
  ['<kbd>Q</kbd> <kbd>M</kbd> <kbd>K</kbd> <kbd>I</kbd>', T('Luyện tập · giọng nói · ghi hình · đọc chú thích', 'Quiz · voice · recording · read the description')],
  ['Kéo chuột', T('Xoay mô hình', 'Orbit the model')],
  ['<kbd>R</kbd> <kbd>L</kbd> <kbd>T</kbd>', T('Tự xoay · chú thích · vệt hạt', 'Auto-rotate · labels · particle trails')],
  ['<kbd>C</kbd> <kbd>D</kbd> <kbd>H</kbd>', T('Camera · minh họa cử chỉ · hướng dẫn này', 'Camera · gesture demo · this help')],
];

const at = (locale, pair) => (locale === 'en' ? pair[1] : pair[0]);

/** Đổi phần chữ của một phần tử mà không xoá <input>/<span> con bên trong. */
function setText(element, text) {
  const node = [...element.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (node) {
    const raw = node.textContent;
    node.textContent = (/^\s/.test(raw) ? ' ' : '') + text + (/\s$/.test(raw) ? ' ' : '');
    return;
  }
  if (!element.children.length) element.textContent = text;
}

/** Đặt lại chữ trong các nút, nhãn và ô chọn dựng sẵn trong index.html. */
export function applyStatic(locale) {
  const root = document;
  for (const [selector, pair, attribute] of STATIC) {
    const element = root.querySelector(selector);
    if (!element) continue;
    const text = at(locale, pair);
    if (attribute) element.setAttribute(attribute, text);
    else setText(element, text);
  }
  for (const [id, rows] of Object.entries(OPTIONS)) {
    const select = root.getElementById(id);
    if (!select) continue;
    for (const option of select.options) {
      const row = rows.find(([value]) => value === option.value);
      if (row) option.textContent = at(locale, [row[1], row[2]]);
    }
  }
  const steps = root.querySelector('.start-card .steps');
  if (steps) {
    steps.innerHTML = START_STEPS.map(([icon, pair]) =>
      `<li><span class="step-ic">${icon}</span><span>${at(locale, pair)}</span></li>`).join('');
  }
  const help = root.querySelector('#help table');
  if (help) {
    help.innerHTML = HELP_ROWS.map(([keys, pair]) =>
      `<tr><td>${keys}</td><td>${at(locale, pair)}</td></tr>`).join('');
  }
  const guide = root.getElementById('scanGuide');
  if (guide) {
    guide.innerHTML = locale === 'en'
      ? '<span><b>One hand:</b> open it and hold still to scan your hand.</span><span><b>Two hands:</b> frame the area with your index fingers, then close both hands to capture.</span>'
      : '<span><b>Một tay:</b> xòe và giữ yên để quét tay.</span><span><b>Hai tay:</b> tạo khung bằng ngón trỏ, nắm lại để chụp.</span>';
  }
}

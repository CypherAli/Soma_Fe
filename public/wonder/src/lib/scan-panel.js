// Scan feedback belongs outside the moving camera overlay. Update only changed text.
const put = (node, text) => { if (node.textContent !== text) node.textContent = text; };

export class ScanPanel {
  constructor(root, { onStart, onCancel, onSelect, word }) {
    this.root = root;
    this.find = id => root.querySelector('#' + id);
    this.onSelect = onSelect;
    // `word(vi, en)` do app truyền vào để khung quét theo đúng ngôn ngữ của trang.
    this.word = word || ((vi) => vi);
    this.phase = 'closed';
    this.resultImage = document.createElement('img');
    this.resultImage.alt = this.word('Vùng camera đã chụp', 'Captured camera area');
    this.resultMessage = document.createElement('p');
    this.resultMessage.className = 'scan-error';
    this.choices = document.createElement('div');
    this.choiceButtons = new Map();
    this.find('scanResults').replaceChildren(this.resultImage, this.resultMessage, this.choices);
    this.find('scanCamera').onclick = onStart;
    this.find('scanCancel').onclick = onCancel;
  }

  camera(active) {
    this.cameraActive = active;
    if (this.phase === 'closed') put(this.find('scanCamera'), active ? this.word('Quét bộ phận', 'Scan a body part') : this.word('Bật camera để quét', 'Start the camera to scan'));
  }

  close() {
    this.phase = 'closed';
    this.root.classList.remove('scanning');
    this.root.dataset.scanPhase = 'closed';
    this.find('scanFeedback').hidden = true;
    this.find('scanGuide').hidden = true;
    this.find('scanResults').hidden = true;
    this.find('scanCancel').hidden = true;
    this.find('scanCamera').disabled = false;
    this.find('scanProgress').removeAttribute('aria-busy');
    put(this.find('cameraHint'), this.word('Giữ bàn tay trong khung hình', 'Keep your hand in the frame'));
    this.camera(this.cameraActive);
  }

  begin() {
    this.phase = 'preparing';
    this.root.classList.add('scanning');
    this.root.dataset.scanPhase = this.phase;
    this.find('scanFeedback').hidden = false;
    this.find('scanGuide').hidden = false;
    this.find('scanResults').hidden = true;
    this.find('scanCancel').hidden = false;
    this.find('scanCamera').disabled = true;
    put(this.find('scanCamera'), this.word('Đang chuẩn bị…', 'Preparing…'));
    put(this.find('scanCancel'), this.word('Hủy quét', 'Cancel scan'));
    put(this.find('scanTitle'), this.word('Chuẩn bị camera', 'Preparing the camera'));
    put(this.find('scanInstruction'), this.word('Đợi camera sẵn sàng để bắt đầu quét.', 'Wait for the camera to be ready, then start scanning.'));
    put(this.find('cameraHint'), this.word('Camera vẫn bật khi trở về mô hình', 'The camera stays on when you return to the model'));
    this.progress(0);
  }

  progress(value, busy = false) {
    const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
    const bar = this.find('scanProgress');
    if (bar.getAttribute('aria-valuenow') !== String(percent)) {
      bar.setAttribute('aria-valuenow', String(percent));
      this.find('scanProgressFill').style.width = percent + '%';
    }
    if (bar.getAttribute('aria-busy') !== String(busy)) bar.setAttribute('aria-busy', String(busy));
    put(this.find('scanPercent'), busy ? this.word('Đang xử lý', 'Working') : percent + '%');
  }

  frame(state) {
    if (this.phase === 'closed' || this.phase === 'results' || this.phase === 'error') return;
    const busy = state.phase === 'busy';
    const waiting = state.phase === 'idle';
    this.phase = busy ? 'busy' : 'scanning';
    if (this.root.dataset.scanPhase !== this.phase) this.root.dataset.scanPhase = this.phase;
    put(this.find('scanCamera'), busy ? this.word('Đang nhận diện…', 'Recognising…') : waiting ? this.word('Đang chờ tay…', 'Waiting for a hand…') : this.word('Đang quét…', 'Scanning…'));
    const title = busy ? this.word('Đang nhận diện vùng đã chụp', 'Recognising the captured area')
      : waiting ? this.word('Chưa thấy tay trong khung', 'No hand in the frame yet')
      : state.mode === 'none' ? this.word('Quét toàn khung', 'Scanning the full frame')
      : state.mode === 'hand' ? this.word('Quét bàn tay và cẳng tay', 'Scanning the hand and forearm')
      : this.word('Ngắm vùng cần quan sát', 'Aim at the area you want to inspect');
    const instruction = busy ? this.word('Chờ kết quả. Bạn có thể hủy bất cứ lúc nào.', 'Waiting for the result. You can cancel at any time.')
      : waiting ? this.word('Giơ bàn tay xòe hoặc hai ngón trỏ để chọn vùng quét.', 'Show an open hand or both index fingers to choose the area to scan.')
      : state.mode === 'none' ? this.word('Giữ yên hoặc giơ tay để chọn một vùng cụ thể.', 'Hold still, or show a hand to pick a specific area.')
      : state.mode === 'hand' ? this.word('Xòe tay, giữ yên khoảng 1,2 giây để tự chụp.', 'Open your hand and hold still for about 1.2 s to capture automatically.')
      : this.word('Dùng hai ngón trỏ tạo khung, nắm cả hai tay để chụp.', 'Frame the area with both index fingers, then close both hands to capture.');
    put(this.find('scanTitle'), title);
    put(this.find('scanInstruction'), instruction);
    this.progress(busy ? 1 : state.progress, busy);
    if (waiting) put(this.find('scanPercent'), this.word('Chờ tay', 'Waiting for a hand'));
  }

  result({ shot, error, rows = [] }, catalog) {
    const usable = rows.filter(row => catalog.some(model => model.id === row.id));
    this.phase = usable.length ? 'results' : 'error';
    this.root.classList.add('scanning');
    this.root.dataset.scanPhase = this.phase;
    this.find('scanFeedback').hidden = false;
    this.find('scanGuide').hidden = true;
    this.find('scanCancel').hidden = false;
    this.find('scanCamera').disabled = false;
    put(this.find('scanCamera'), this.word('Quét lại', 'Scan again'));
    put(this.find('scanCancel'), this.word('Trở về mô hình', 'Back to the model'));
    put(this.find('scanTitle'), usable.length ? this.word('Chọn mô hình phù hợp', 'Choose a matching model') : this.word('Chưa có kết quả phù hợp', 'No matching result'));
    put(this.find('scanInstruction'), usable.length ? this.word('Gợi ý từ vùng đã quét. Chọn để mở mô hình 3D.', 'Suggestions from the scanned area. Pick one to open the 3D model.') : this.word('Điều chỉnh theo hướng dẫn bên dưới rồi quét lại.', 'Adjust as described below, then scan again.'));
    this.progress(1);
    this.find('scanPercent').textContent = usable.length ? this.word(usable.length + ' gợi ý', usable.length + ' suggestions') : this.word('Thử lại', 'Try again');
    const result = this.find('scanResults');
    result.hidden = false;
    this.resultImage.hidden = !shot;
    if (shot && this.resultImage.getAttribute('src') !== shot) this.resultImage.src = shot;
    this.resultMessage.hidden = !error;
    put(this.resultMessage, error || '');
    for (const [id, button] of this.choiceButtons) {
      if (!usable.some(row => row.id === id)) { button.remove(); this.choiceButtons.delete(id); }
    }
    for (const [index, row] of usable.entries()) {
      let button = this.choiceButtons.get(row.id);
      if (!button) {
        button = document.createElement('button');
        button.className = 'scan-choice';
        button.onclick = () => this.onSelect(row.id);
        this.choiceButtons.set(row.id, button);
      }
      put(button, row.name);
      if (this.choices.children[index] !== button) this.choices.insertBefore(button, this.choices.children[index] || null);
    }
    // A newer recognition result can refine these choices without collapsing the panel.
    put(this.find('cameraHint'), this.word('Camera vẫn bật khi trở về mô hình', 'The camera stays on when you return to the model'));
  }
}

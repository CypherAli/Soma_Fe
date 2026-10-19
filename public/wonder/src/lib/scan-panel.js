// Scan feedback belongs outside the moving camera overlay. Update only changed text.
const put = (node, text) => { if (node.textContent !== text) node.textContent = text; };

export class ScanPanel {
  constructor(root, { onStart, onCancel, onSelect }) {
    this.root = root;
    this.find = id => root.querySelector('#' + id);
    this.onSelect = onSelect;
    this.phase = 'closed';
    this.resultImage = document.createElement('img');
    this.resultImage.alt = 'Vùng camera đã chụp';
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
    if (this.phase === 'closed') put(this.find('scanCamera'), active ? 'Quét bộ phận' : 'Bật camera để quét');
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
    put(this.find('cameraHint'), 'Giữ bàn tay trong khung hình');
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
    put(this.find('scanCamera'), 'Đang chuẩn bị…');
    put(this.find('scanCancel'), 'Hủy quét');
    put(this.find('scanTitle'), 'Chuẩn bị camera');
    put(this.find('scanInstruction'), 'Đợi camera sẵn sàng để bắt đầu quét.');
    put(this.find('cameraHint'), 'Camera vẫn bật khi trở về mô hình');
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
    put(this.find('scanPercent'), busy ? 'Đang xử lý' : percent + '%');
  }

  frame(state) {
    if (this.phase === 'closed' || this.phase === 'results' || this.phase === 'error') return;
    const busy = state.phase === 'busy';
    const waiting = state.phase === 'idle';
    this.phase = busy ? 'busy' : 'scanning';
    if (this.root.dataset.scanPhase !== this.phase) this.root.dataset.scanPhase = this.phase;
    put(this.find('scanCamera'), busy ? 'Đang nhận diện…' : waiting ? 'Đang chờ tay…' : 'Đang quét…');
    const title = busy ? 'Đang nhận diện vùng đã chụp' : waiting ? 'Chưa thấy tay trong khung' : state.mode === 'none' ? 'Quét toàn khung'
      : state.mode === 'hand' ? 'Quét bàn tay và cẳng tay' : 'Ngắm vùng cần quan sát';
    const instruction = busy ? 'Chờ kết quả. Bạn có thể hủy bất cứ lúc nào.'
      : waiting ? 'Giơ bàn tay xòe hoặc hai ngón trỏ để chọn vùng quét.'
      : state.mode === 'none' ? 'Giữ yên hoặc giơ tay để chọn một vùng cụ thể.'
      : state.mode === 'hand' ? 'Xòe tay, giữ yên khoảng 1,2 giây để tự chụp.'
      : 'Dùng hai ngón trỏ tạo khung, nắm cả hai tay để chụp.';
    put(this.find('scanTitle'), title);
    put(this.find('scanInstruction'), instruction);
    this.progress(busy ? 1 : state.progress, busy);
    if (waiting) put(this.find('scanPercent'), 'Chờ tay');
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
    put(this.find('scanCamera'), 'Quét lại');
    put(this.find('scanCancel'), 'Trở về mô hình');
    put(this.find('scanTitle'), usable.length ? 'Chọn mô hình phù hợp' : 'Chưa có kết quả phù hợp');
    put(this.find('scanInstruction'), usable.length ? 'Gợi ý từ vùng đã quét. Chọn để mở mô hình 3D.' : 'Điều chỉnh theo hướng dẫn bên dưới rồi quét lại.');
    this.progress(1);
    this.find('scanPercent').textContent = usable.length ? usable.length + ' gợi ý' : 'Thử lại';
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
    put(this.find('cameraHint'), 'Camera vẫn bật khi trở về mô hình');
  }
}

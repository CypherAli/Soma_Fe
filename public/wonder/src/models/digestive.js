// Full消化器 còn thiếu của đồ án: Gan, Dạ dày, Ruột, Túi mật, Tụy, Hệ cơ.
// Dùng cùng primitives như body.js (blob/vessel/pathTube) nên gesture explode/pick/quiz hoạt động y hệt.
import { paramSurface, ellipsoid, TAU } from '../lib/sampling.js';
import { spline, vessel, pathTube, blob } from '../lib/shapes.js';
import { G } from './engines.js';

function liverGroups() {
  const rightLobe = [blob([0, 230, 0], [55, 32, 40], { density: 0.9 })];
  const leftLobe = [blob([52, 238, 6], [26, 22, 30], { density: 0.9 })];
  const gallbladder = [ellipsoid([8, 205, 28], [10, 16, 10], 1.2)];
  const bileDuct = [vessel([[8, 195, 28], [10, 175, 22], [12, 160, 18]], 3, 2.5, 1.4)];
  const portalVein = [vessel([[-30, 190, -10], [-5, 205, -2], [0, 215, 0]], 6, 5, 1.2)];
  const hepaticArtery = [vessel([[30, 185, -8], [10, 200, 0], [2, 212, 2]], 4, 3.5, 1.3)];
  return [
    G('Thùy gan phải', [0.72, 0.32, 0.22], [-90, 20, 0], 0, rightLobe, { info: 'thùy lớn nhất: lọc máu, tạo mật, dự trữ glycogen' }),
    G('Thùy gan trái', [0.85, 0.45, 0.3], [90, 40, 0], 0, leftLobe, { info: 'thùy nhỏ hơn, ôm lấy dạ dày' }),
    G('Túi mật', [0.35, 0.8, 0.3], [0, -80, 120], 0.15, gallbladder, { info: 'chứa và cô đặc mật để tiêu mỡ' }),
    G('Ống mật chủ', [0.4, 0.9, 0.4], [0, -110, 60], 0.25, bileDuct, { info: 'dẫn mật xuống tá tràng' }),
    G('Tĩnh mạch cửa', [0.4, 0.5, 1.0], [-120, -40, -60], 0.2, portalVein, { info: 'đưa máu giàu dinh dưỡng từ ruột về gan' }),
    G('Động mạch gan', [1.0, 0.25, 0.25], [120, -40, -60], 0.2, hepaticArtery, { info: 'mang máu giàu oxy nuôi gan' }),
  ];
}

function stomachGroups() {
  const fundus = [blob([-18, 232, 4], [20, 16, 14], { density: 1 })];
  const bodyS = [blob([0, 214, 6], [24, 26, 16], { density: 1 })];
  const pylorus = [vessel([[18, 200, 6], [34, 196, 4], [48, 196, 2]], 8, 6, 1.1)];
  const esophagus = [vessel([[-14, 280, 0], [-16, 258, 2], [-18, 244, 4]], 8, 8, 1.1)];
  const duodenum = [vessel([[48, 196, 2], [58, 182, 0], [52, 166, -2], [30, 160, -2]], 7, 6, 1.1)];
  return [
    G('Thực quản', [1.0, 0.75, 0.6], [0, 120, 0], 0, esophagus, { info: 'ống cơ đẩy thức ăn xuống dạ dày' }),
    G('Đáy vị', [1.0, 0.6, 0.5], [-80, 60, 0], 0.05, fundus, { info: 'chứa khí và thức ăn mới tới' }),
    G('Thân vị', [1.0, 0.5, 0.42], [0, 0, 130], 0.05, bodyS, { info: 'trộn acid HCl và enzyme pepsin' }),
    G('Môn vị', [0.9, 0.45, 0.35], [110, -30, 0], 0.15, pylorus, { info: 'van xả thức ăn xuống ruột non' }),
    G('Tá tràng', [1.0, 0.8, 0.5], [90, -90, -40], 0.2, duodenum, { info: 'đoạn đầu ruột non: nhận mật và dịch tụy' }),
  ];
}

function intestineGroups() {
  const jejunumPath = spline([[-40, 190, 6], [40, 190, 8], [40, 172, 10], [-40, 172, 10], [-40, 154, 9], [40, 154, 8], [40, 136, 6], [-20, 136, 5]], 10);
  const jejunum = [pathTube(jejunumPath, 7, 1.1)];
  const ileumPath = spline([[-20, 136, 5], [30, 130, 4], [30, 114, 3], [-30, 114, 3], [-30, 100, 2]], 10);
  const ileum = [pathTube(ileumPath, 6, 1.1)];
  const frame = spline([[40, 200, 0], [55, 190, 0], [55, 110, 0], [40, 95, 0], [-40, 95, 0], [-55, 110, 0], [-55, 190, 0], [-40, 200, 0]], 10);
  const colon = [pathTube(frame, 9, 1.0)];
  const appendix = [vessel([[-38, 100, 0], [-48, 88, 2], [-52, 78, 2]], 3, 2, 1.4)];
  const rectum = [vessel([[0, 95, 0], [0, 75, 0], [0, 60, 0]], 8, 7, 1.1)];
  return [
    G('Hỗng tràng', [1.0, 0.72, 0.5], [0, 30, 150], 0.1, jejunum, { info: 'hấp thu dinh dưỡng: ~2.5 m' }),
    G('Hồi tràng', [1.0, 0.62, 0.42], [0, -30, 150], 0.15, ileum, { info: 'hấp thu B12 và muối mật' }),
    G('Đại tràng khung', [0.85, 0.6, 0.4], [0, 0, -140], 0.05, colon, { info: 'hấp thu nước, tạo khuôn phân: ~1.5 m' }),
    G('Ruột thừa', [1.0, 0.5, 0.6], [-110, -60, 40], 0.3, appendix, { info: 'túi miễn dịch, viêm là cấp cứu' }),
    G('Trực tràng', [0.9, 0.5, 0.45], [0, -140, 0], 0.25, rectum, { info: 'chứa phân trước khi thải' }),
  ];
}

function pancreasSpleenGroups() {
  const pancreas = [blob([10, 200, -8], [28, 8, 8], { density: 1.1 })];
  const spleen = [ellipsoid([-52, 222, -6], [10, 14, 8], 1.1)];
  const duct = [vessel([[-14, 200, -8], [10, 200, -4], [34, 196, 0]], 2, 1.5, 1.5)];
  return [
    G('Tụy', [1.0, 0.85, 0.55], [80, 0, 60], 0.1, pancreas, { info: 'tiết insulin và enzyme tiêu hóa' }),
    G('Ống tụy', [1.0, 0.9, 0.6], [60, -60, 80], 0.25, duct, { info: 'đổ dịch tụy vào tá tràng' }),
    G('Lá lách', [0.7, 0.3, 0.5], [-110, 30, -40], 0.1, spleen, { info: 'lọc máu, kho bạch cầu và tiểu cầu' }),
  ];
}

function muscleGroups() {
  const chest = [paramSurface((u, t) => [70 * Math.cos(u), 250 + 50 * t, 42 * Math.sin(u)], 0, TAU, 0, 1, { density: 0.5, gu: 28, gv: 8 })];
  const biceps = [vessel([[38, 283, 6], [44, 250, 6], [48, 228, 4]], 9, 7, 0.9)];
  const bicepsL = [vessel([[-38, 283, 6], [-44, 250, 6], [-48, 228, 4]], 9, 7, 0.9)];
  const abs = [paramSurface((u, t) => [26 * Math.cos(u), 175 + 55 * t, 20 * Math.sin(u)], 0, TAU, 0, 1, { density: 0.55, gu: 20, gv: 8 })];
  const quad = [vessel([[16, 178, 6], [18, 130, 4], [19, 102, 4]], 12, 9, 0.9)];
  const quadL = [vessel([[-16, 178, 6], [-18, 130, 4], [-19, 102, 4]], 12, 9, 0.9)];
  return [
    G('Cơ ngực', [0.9, 0.3, 0.3], [0, 40, 150], 0, chest, { info: 'khép và xoay cánh tay' }),
    G('Cơ nhị đầu', [1.0, 0.4, 0.35], [110, 30, 0], 0.05, biceps, { info: 'gập khuỷu tay' }),
    G('Cơ nhị đầu (T)', [1.0, 0.4, 0.35], [-110, 30, 0], 0.05, bicepsL, { showLabel: false }),
    G('Cơ bụng 6 múi', [0.95, 0.35, 0.3], [0, -20, 150], 0.05, abs, { info: 'gập thân, bảo vệ nội tạng' }),
    G('Cơ tứ đầu đùi', [1.0, 0.45, 0.35], [60, -70, 60], 0.1, quad, { info: 'duỗi gối: đứng, đi, chạy' }),
    G('Cơ tứ đầu đùi (T)', [1.0, 0.45, 0.35], [-60, -70, 60], 0.1, quadL, { showLabel: false }),
  ];
}

export const DIGESTIVE = [
  { name: 'Gan & Túi mật', groups: liverGroups, color: [0.8, 0.38, 0.25], tilt: 6, viewYaw: 0.6, fact: 'tạng lớn nhất ~1.5 kg · 500+ chức năng' },
  { name: 'Dạ dày', groups: stomachGroups, color: [1.0, 0.58, 0.48], tilt: 6, viewYaw: 0.6, fact: 'chứa ~1.5 L · acid pH 1.5-2' },
  { name: 'Ruột non & Đại tràng', groups: intestineGroups, color: [1.0, 0.7, 0.48], tilt: 6, viewYaw: 0.5, fact: 'ruột non ~6 m · đại tràng ~1.5 m' },
  { name: 'Tụy & Lá lách', groups: pancreasSpleenGroups, color: [1.0, 0.8, 0.5], tilt: 6, viewYaw: 0.6, fact: 'tụy tiết insulin · lách lọc máu' },
  { name: 'Hệ cơ', groups: muscleGroups, color: [0.95, 0.35, 0.32], tilt: 4, viewYaw: 0.55, fact: '~600 cơ · 40% khối lượng cơ thể' },
];

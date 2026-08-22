import frames from "./modelFrames.json";

/**
 * KHUNG HÌNH CHUẨN — một mô hình luôn được nhìn từ cùng một hướng, cùng một
 * khoảng cách, quanh cùng một tâm, bất kể đang bật tắt lớp nào.
 *
 * Trước đây viewer để `<Bounds fit>` tự canh theo mesh ĐANG mount và `<Center>`
 * tự dời tâm theo hộp bao toàn bộ. Hai thứ đó khiến khung hình đổi khi: xuất
 * lại model (lọt thêm một sợi mạch trườn ra ngoài vùng là hộp bao phình, model
 * bị đẩy lệch và thu nhỏ), tắt một lớp, hay chỉ là đổi kích thước cửa sổ. Con
 * số đo được: hộp bao thật rộng hơn khung ổn định tới 1,24 lần ở cerebellum.
 *
 * Bảng `modelFrames.json` sinh bằng `npm run models:frames`, `render_glb_preview.py`
 * đọc CÙNG bảng này nên ảnh thumbnail và trang xem khớp nhau.
 */

export type ModelFrame = {
  /** JSON không giữ được kiểu bộ ba nên khai báo là mảng; luôn đủ 3 phần tử. */
  center: number[];
  size: number[];
  radius: number;
  tris: number;
  bytes: number;
  nodes: number;
  meshes: number;
  box: { min: number[]; max: number[]; size: number[] };
};

/**
 * Hướng nhìn chuẩn: chính diện trước, chếch nhẹ sang phải và cao hơn tâm một
 * chút. Chếch nhẹ chứ không nhìn thẳng tuyệt đối — mặt phẳng chính diện tuyệt
 * đối làm mọi cấu trúc chồng lên nhau thành hình bẹt, còn chếch quá thì bảng
 * nhãn hai bên không còn đối xứng giữa các scene.
 */
export const VIEW_DIR: [number, number, number] = [0.18, 0.12, 1];

/** Khung hình chừa quanh vật thể. 1.0 = vật thể chạm mép khung. */
export const VIEW_MARGIN = 1.18;

const TABLE = frames.frames as Record<string, ModelFrame>;

/** Tra khung theo url model ("/models/head.glb" hoặc "head.glb"). */
export function modelFrame(url: string): ModelFrame | null {
  const file = url.split("/").pop() ?? url;
  return TABLE[file] ?? null;
}

/**
 * Khoảng cách camera để model vừa khít khung.
 *
 * Bao theo HÌNH TRỤ ĐỨNG quanh model chứ không phải hình cầu: mô hình chỉ tự
 * xoay quanh trục đứng, nên bề ngang cần chừa là đường chéo mặt bằng, còn
 * chiều cao thì không đổi khi xoay. Bao hình cầu (nửa đường chéo khối) an toàn
 * nhưng đẩy camera xa thêm 40–70%, model nằm lọt thỏm giữa khung trống.
 *
 * Xét CẢ HAI chiều khung: cửa sổ hẹp ngang (điện thoại) thì góc mở ngang mới
 * là chiều bó, canh theo góc dọc sẽ cắt mất hai bên.
 */
export function fitDistance(size: number[], fovDeg: number, aspect: number): number {
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(aspect, 0.0001));
  const halfHeight = size[1] / 2;
  const halfWidth = Math.hypot(size[0], size[2]) / 2;
  return (
    Math.max(halfHeight / Math.tan(vFov / 2), halfWidth / Math.tan(hFov / 2)) * VIEW_MARGIN
  );
}

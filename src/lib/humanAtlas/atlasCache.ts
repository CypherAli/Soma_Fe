
import { contentFetch } from '@/lib/content/fetch';
import { ATLAS_MANIFEST, atlasAsset, type Atlas } from "./anatomy";
import { decodeModelResponse } from "./modelDownload";

/**
 * BỘ ĐỆM DỮ LIỆU ATLAS DÙNG CHUNG CHO TRANG VISION AI.
 *
 * Trang /cu-chi đổi mô hình NGAY GIỮA PHIÊN (quét ra vùng nào nạp vùng đó), nên
 * manifest và các khối .bin phải tải MỘT LẦN rồi giữ lại: đổi từ khuỷu sang
 * cẳng tay mà tải lại 4 MB mỗi lần thì người dùng đứng chờ trong lúc tay vẫn
 * đang giơ trước camera. Mỗi khối chỉ tải khi có scene cần tới nó — bài khuỷu
 * không kéo theo khối chứa não.
 */

let manifest: Promise<Atlas> | null = null;
const chunks = new Map<number, Promise<ArrayBuffer>>();

export function loadAtlasManifest(): Promise<Atlas> {
  manifest ??= contentFetch(ATLAS_MANIFEST).then((r) => {
    if (!r.ok) throw new Error("Không tải được danh mục atlas.");
    return r.json() as Promise<Atlas>;
  });
  // Lỗi mạng một lần không được khoá chết bộ đệm: lần sau phải thử lại.
  manifest.catch(() => {
    manifest = null;
  });
  return manifest;
}

export function loadAtlasChunk(atlas: Atlas, index: number): Promise<ArrayBuffer> {
  let job = chunks.get(index);
  if (!job) {
    const c = atlas.chunks[index];
    const compressed = !!c.gzip && typeof DecompressionStream !== "undefined";
    job = contentFetch(atlasAsset(compressed ? c.gzip! : c.url)).then((r) =>
      decodeModelResponse(r, c.bytes, compressed),
    );
    job.catch(() => chunks.delete(index));
    chunks.set(index, job);
  }
  return job;
}

"use client";

import { useEffect } from "react";
import type { VoiceAction } from "./match";

/**
 * SỔ ĐĂNG KÝ LỆNH GIỌNG NÓI CỦA TỪNG TRANG.
 *
 * Soma Bot nằm ở layout nên có mặt ở MỌI trang, nhưng chỉ trang mới biết mình
 * làm được gì (trang mô hình bật được lớp, trang Vision AI quét được bộ phận).
 * Trang đăng ký lệnh khi mở và tự gỡ khi rời đi — bot chỉ việc hỏi sổ này.
 * Lệnh của trang được xét TRƯỚC lệnh chung của bot.
 */

const owners = new Map<string, VoiceAction[]>();

export function registerVoiceActions(owner: string, actions: VoiceAction[]): () => void {
  owners.set(owner, actions);
  return () => {
    if (owners.get(owner) === actions) owners.delete(owner);
  };
}

/** Mọi lệnh đang có, trang đăng ký SAU CÙNG đứng trước (thường là trang đang xem). */
export function pageVoiceActions(): VoiceAction[] {
  return [...owners.values()].reverse().flat();
}

/**
 * Đăng ký lệnh cho một component. `actions` nên được memo hoá; mỗi lần nó đổi
 * thì bản cũ bị thay. Hàm `run` nên dùng setState dạng hàm / ref để luôn đọc
 * trạng thái mới nhất mà không phải đăng ký lại mỗi lần render.
 */
export function useVoiceActions(owner: string, actions: VoiceAction[]): void {
  useEffect(() => registerVoiceActions(owner, actions), [owner, actions]);
}

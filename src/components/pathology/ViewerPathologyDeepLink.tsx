"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/auth";
import { useAnatomyStore, type SystemKey } from "@/store/useAnatomyStore";

type StructureResponse = { code: string; meshName?: string | null; nameVi: string; latin?: string | null; descriptionVi?: string | null };
type PathologyResponse = {
  id: string;
  nameVi: string;
  latin?: string | null;
  lesionMesh?: string | null;
  lesionSystem?: string | null;
};

/**
 * Giống hệt THREE.PropertyBinding.sanitizeNodeName mà GLTFLoader dùng để đặt
 * `mesh.name`: khoảng trắng thành "_", rồi BỎ mọi ký tự không phải \w hoặc "-".
 * Store so khớp cô lập theo `mesh.name`, nên tên thô trong DB ("Oesophagus.001")
 * phải qua đây trước, nếu không sẽ cô lập vào hư vô mà không báo lỗi gì.
 * Cùng công thức với Soma_Fe/scripts/list_meshes.mjs — sửa thì sửa cả hai.
 */
const sanitizeMeshName = (name: string) => name.replace(/\s/g, "_").replace(/[^\w-]/g, "");

export default function ViewerPathologyDeepLink() {
  const params = useSearchParams();
  const structureCode = params.get("structure");
  const pathologyId = params.get("pathology");
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);
  const setFocusedPathology = useAnatomyStore((s) => s.setFocusedPathology);
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const toggleSystem = useAnatomyStore((s) => s.toggleSystem);

  useEffect(() => {
    setFocusedPathology(pathologyId);
    return () => setFocusedPathology(null);
  }, [pathologyId, setFocusedPathology]);

  /**
   * Ưu tiên neo vào ĐÚNG vị trí tổn thương nếu bệnh có `lesionMesh`
   * (19/106 bệnh, đã đối chiếu bằng `npm run verify:lesions`). Không có thì
   * mới lùi về cô lập cả cấu trúc như trước — bệnh lan toả hoặc model chưa có
   * mesh tương ứng thì cả cơ quan mới là phạm vi đúng.
   */
  useEffect(() => {
    if (!pathologyId) return;
    let alive = true;
    fetch(`${API_URL}/pathologies/${encodeURIComponent(pathologyId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<PathologyResponse>) : Promise.reject()))
      .then((p) => {
        if (!alive || !p.lesionMesh) return;
        const system = p.lesionSystem as SystemKey | undefined;
        // Hệ chứa mesh phải đang bật, không thì cô lập xong vẫn không thấy gì.
        if (system && visibleSystems[system] === false) toggleSystem(system);
        const id = sanitizeMeshName(p.lesionMesh);
        // Tên hiển thị phải là BỘ PHẬN đang chọn, không phải tên bệnh — panel
        // "Thông tin bộ phận" mà ghi "Bệnh gout" là sai nghĩa.
        setSelected({ id, name: p.lesionMesh.replace(/_/g, " ") });
        toggleIsolate(id);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
    // visibleSystems cố ý KHÔNG nằm trong deps: chỉ đọc một lần lúc điều hướng,
    // thêm vào sẽ chạy lại effect ngay sau khi chính nó bật hệ lên.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathologyId, setSelected, toggleIsolate, toggleSystem]);

  useEffect(() => {
    if (!structureCode) return;
    fetch(`${API_URL}/structures/${encodeURIComponent(structureCode)}`)
      .then((r) => (r.ok ? (r.json() as Promise<StructureResponse>) : Promise.reject()))
      .then((structure) => {
        // Bệnh có lesionMesh thì effect ở trên đã chọn chỗ chính xác hơn rồi.
        if (useAnatomyStore.getState().isolatedId) return;
        const id = structure.meshName || structure.code;
        setSelected({ id, name: structure.nameVi, latin: structure.latin ?? undefined, description: structure.descriptionVi ?? undefined });
        toggleIsolate(id);
      })
      .catch(() => undefined);
  }, [structureCode, setSelected, toggleIsolate]);

  return null;
}

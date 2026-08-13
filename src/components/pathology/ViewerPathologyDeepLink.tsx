"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/auth";
import { useAnatomyStore } from "@/store/useAnatomyStore";

type StructureResponse = { code: string; meshName?: string | null; nameVi: string; latin?: string | null; descriptionVi?: string | null };

export default function ViewerPathologyDeepLink() {
  const params = useSearchParams();
  const structureCode = params.get("structure");
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);

  useEffect(() => {
    if (!structureCode) return;
    fetch(`${API_URL}/structures/${encodeURIComponent(structureCode)}`)
      .then((r) => r.ok ? r.json() as Promise<StructureResponse> : Promise.reject())
      .then((structure) => {
        const id = structure.meshName || structure.code;
        setSelected({ id, name: structure.nameVi, latin: structure.latin ?? undefined, description: structure.descriptionVi ?? undefined });
        toggleIsolate(id);
      })
      .catch(() => undefined);
  }, [structureCode, setSelected, toggleIsolate]);

  return null;
}

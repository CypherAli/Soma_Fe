"use client";
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function WebsiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.endsWith('/bo-model-preview') ? null : children;
}

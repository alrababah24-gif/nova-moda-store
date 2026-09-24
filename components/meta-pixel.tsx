"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    // أول PageView محسوب من الكود الرئيسي
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
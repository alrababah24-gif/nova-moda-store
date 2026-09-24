"use client";
import { useEffect, useState } from "react";

// BrandRail مصلح - بدون Date.now() او Math.random() اللي بتعمل React #418
export function BrandRail() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  // لا ترسم اي شي متغير بين السيرفر والكلاينت
  return (
    <div className="border-y border-black/10 py-3 overflow-hidden bg-white" suppressHydrationWarning>
      <div className="flex gap-8 whitespace-nowrap text-[13px] tracking-[0.2em] opacity-60" suppressHydrationWarning>
        <span>NOVA MODA</span><span>•</span><span>عبايات فاخرة</span><span>•</span><span>NOVA MODA</span><span>•</span><span>عبايات عصرية</span><span>•</span><span>NOVA MODA</span><span>•</span><span>عبايات مصممة بعناية</span><span>•</span><span>NOVA MODA</span>
      </div>
    </div>
  );
}
export default BrandRail;

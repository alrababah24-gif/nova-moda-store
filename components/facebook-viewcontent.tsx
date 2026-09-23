"use client";
import { useEffect } from "react";

export default function FacebookViewContent({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
}) {
  useEffect(() => {
    const fire = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        const cleanId = String(id).trim();
        if (!cleanId) return false;
        
        // نبعت بس الـ ID والنوع - بدون عملة عشان ما يطلع تحذير
        (window as any).fbq("track", "ViewContent", {
          content_ids: [cleanId],
          content_type: "product",
          content_name: String(name || ""),
        });
        console.log("✅ ViewContent fired (no currency):", cleanId);
        return true;
      }
      return false;
    };

    if (!fire()) {
      const interval = setInterval(() => {
        if (fire()) clearInterval(interval);
      }, 500);
      setTimeout(() => clearInterval(interval), 10000);
      return () => clearInterval(interval);
    }
  }, [id, name, price]);

  return null;
}

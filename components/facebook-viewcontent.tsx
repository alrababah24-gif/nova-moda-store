"use client";
import { useEffect } from "react";

// هذا الكومبوننت بفهم الطريقتين: id/name/price أو productId/productName/value
type Props = {
  id?: string;
  name?: string;
  price?: number;
  productId?: string;
  productName?: string;
  value?: number;
  currency?: string;
};

export default function FacebookViewContent(props: Props) {
  useEffect(() => {
    const fire = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        // ياخذ الـ ID من أي واحدة موجودة
        const rawId = props.id || props.productId || "";
        const cleanId = String(rawId).trim();
        if (!cleanId) return false;

        const rawName = props.name || props.productName || "";
        
        // بدون عملة عشان ما يطلع تحذير المثلث الأصفر
        (window as any).fbq("track", "ViewContent", {
          content_ids: [cleanId],
          content_type: "product",
          content_name: String(rawName),
        });
        console.log("✅ ViewContent fired:", cleanId);
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
  }, [props.id, props.productId, props.name, props.productName, props.price, props.value]);

  return null;
}

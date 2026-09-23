"use client";
import { useEffect } from "react";

export default function FacebookViewContent({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: any;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_ids: [id],
        content_name: name,
        content_type: "product",
        value: Number(price) || 0,
        currency: "JOD",
      });
    }
  }, [id, name, price]);

  return null;
}

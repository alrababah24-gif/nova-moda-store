"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

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
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_ids: [id],
        content_name: name,
        content_type: "product",
        value: price,
        currency: "JOD",
      });
      // console.log("ViewContent sent for", id);
    }
  }, [id, name, price]);

  return null;
}

export type MediaUploadFolder = "products" | "brands" | "store";

export async function uploadMedia(file: File, folder: MediaUploadFolder) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const response = await fetch("/api/admin/media/upload", {
    method: "POST",
    body,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    url?: string;
    fileId?: string;
    error?: string;
  };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error || "ØªØ¹Ø°Ø± Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±Ø© Ø¥Ù„Ù‰ ImageKit");
  }

  return { url: payload.url, fileId: payload.fileId };
}


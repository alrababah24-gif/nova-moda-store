export type MediaUploadFolder = "products" | "brands" | "store";

// Netlify Functions reject request bodies above ~6MB, so large phone photos
// are resized and re-encoded in the browser before being sent to the API.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 2400;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("تعذر قراءة الصورة. جربي صورة JPG أو PNG.")); };
    img.src = url;
  });
}

async function prepareImage(file: File) {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  if (file.size <= MAX_UPLOAD_BYTES && !/heic|heif/i.test(file.type)) return file;

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch (error) {
    if (file.size <= MAX_UPLOAD_BYTES) return file;
    throw error;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.86, 0.75, 0.6]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && (blob.size <= MAX_UPLOAD_BYTES || quality === 0.6)) {
      return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "image"}.jpg`, { type: "image/jpeg" });
    }
  }
  return file;
}

export async function uploadMedia(file: File, folder: MediaUploadFolder) {
  const prepared = await prepareImage(file);
  if (prepared.size > 5.5 * 1024 * 1024) throw new Error("حجم الصورة كبير جداً. جربي صورة أصغر من 5MB.");

  const body = new FormData();
  body.append("file", prepared);
  body.append("folder", folder);

  const response = await fetch("/api/admin/media/upload", { method: "POST", body });
  const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    if (response.status === 413) throw new Error("حجم الصورة كبير جداً. جربي صورة أصغر.");
    throw new Error(payload.error || "تعذر رفع الصورة");
  }
  return payload.url;
}

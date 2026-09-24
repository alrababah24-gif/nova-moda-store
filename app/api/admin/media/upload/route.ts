import { NextResponse } from "next/server";
import { hasStaffPermission } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Supabase Storage buckets were removed after the media migration, so all
// admin uploads go to ImageKit through this server route (keeps the private key server-side).
const folders: Record<string, string> = {
  products: "/nova-moda/products",
  brands: "/nova-moda/brands",
  store: "/nova-moda/store",
};

function safeName(name: string) {
  const ext = name.includes(".") ? `.${name.split(".").pop()}` : ".jpg";
  const stem = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  return `${stem}-${Date.now()}${ext.toLowerCase()}`;
}

async function authorize() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("id,email,role,permissions").eq("id", user.id).maybeSingle();
  const profile = data as Profile | null;
  if (!hasStaffPermission(profile)) return null;
  return { user, profile };
}

export async function POST(request: Request) {
  const auth = await authorize();
  if (!auth) return NextResponse.json({ error: "انتهت جلسة الدخول. سجلي دخول لوحة الإدارة من جديد." }, { status: 403 });

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  if (!privateKey) return NextResponse.json({ error: "IMAGEKIT_PRIVATE_KEY غير مضاف في Netlify." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const folder = folders[String(form.get("folder") || "products")];

  if (!folder) return NextResponse.json({ error: "مجلد رفع غير مسموح." }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "اختاري صورة للرفع." }, { status: 400 });
  if (file.type && !file.type.startsWith("image/")) return NextResponse.json({ error: "يسمح برفع الصور فقط." }, { status: 400 });
  if (file.size > 5.5 * 1024 * 1024) return NextResponse.json({ error: "حجم الصورة كبير. الحد الأقصى 5MB." }, { status: 413 });

  const upload = new FormData();
  upload.append("file", file);
  upload.append("fileName", safeName(file.name));
  upload.append("folder", folder);
  upload.append("useUniqueFileName", "true");

  let response: Response;
  try {
    response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
      body: upload,
    });
  } catch {
    return NextResponse.json({ error: "تعذر الاتصال بـ ImageKit. حاولي مرة أخرى." }, { status: 502 });
  }

  const payload = (await response.json().catch(() => ({}))) as { url?: string; fileId?: string; message?: string; help?: string };

  if (!response.ok || !payload.url) {
    const error = response.status === 401 || response.status === 403
      ? "مفتاح IMAGEKIT_PRIVATE_KEY في Netlify غير صحيح."
      : payload.message || payload.help || "فشل رفع الصورة إلى ImageKit.";
    return NextResponse.json({ error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, url: payload.url, fileId: payload.fileId });
}

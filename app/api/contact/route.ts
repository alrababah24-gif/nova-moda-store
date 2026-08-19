import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "تحققي من البيانات" }, { status: 400 });
    if (parsed.data.company) return NextResponse.json({ ok: true });

    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ error: "قاعدة البيانات غير مفعلة بعد" }, { status: 503 });

    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      message: parsed.data.message,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر إرسال الرسالة حالياً" }, { status: 500 });
  }
}

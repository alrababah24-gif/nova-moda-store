import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات الطلب غير مكتملة", details: parsed.error.flatten() }, { status: 400 });
    }
    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ error: "قاعدة البيانات غير مفعلة بعد" }, { status: 503 });

    const sessionClient = await createClient();
    const { data: { user } } = sessionClient ? await sessionClient.auth.getUser() : { data: { user: null } };

    const { data, error } = await supabase.rpc("create_store_order", {
      p_customer_name: parsed.data.customer_name,
      p_phone: parsed.data.phone,
      p_city: parsed.data.city,
      p_address: parsed.data.address,
      p_notes: parsed.data.notes,
      p_items: parsed.data.items,
      p_user_id: user?.id ?? null,
    });
    if (error) {
      const stockIssue = /stock|unavailable|Product/i.test(error.message || "");
      return NextResponse.json({ error: stockIssue ? "بعض القطع لم تعد متوفرة بالكمية المطلوبة. حدّثي السلة وحاولي مرة ثانية." : "تعذر إنشاء الطلب حالياً." }, { status: stockIssue ? 409 : 500 });
    }
    const order = Array.isArray(data) ? data[0] : data;
    if (!order) throw new Error("Missing order result");

    const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const { data: productRows } = await supabase.from("products").select("id,name").in("id", productIds);
    const names = new Map((productRows || []).map((p) => [String(p.id), String(p.name)]));
    const message = [
      `مرحبا نوفا مودا، تم إنشاء طلبي رقم ${order.order_number}`,
      ...parsed.data.items.map((item) => `- ${names.get(item.productId) || "عباية"} (${item.size}${item.color ? ` • ${item.color}` : ""}) × ${item.qty}`),
      `التوصيل: ${Number(order.delivery_fee)} د.أ`,
      `الإجمالي: ${Number(order.total)} د.أ`,
      `الاسم: ${parsed.data.customer_name}`,
      `الهاتف: ${parsed.data.phone}`,
      `المحافظة: ${parsed.data.city}`,
    ].join("\n");

    return NextResponse.json({ ok: true, orderNumber: order.order_number, total: Number(order.total), whatsapp: order.whatsapp, whatsappMessage: message });
  } catch {
    return NextResponse.json({ error: "حدث خطأ غير متوقع أثناء إنشاء الطلب." }, { status: 500 });
  }
}

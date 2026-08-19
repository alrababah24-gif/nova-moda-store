import { OrdersManager } from "@/components/admin/orders-manager";
import { requireAdmin } from "@/lib/auth";
import type { Order } from "@/lib/types";

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin("orders");
  const [{ data: orders }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("order_items").select("id,order_id,product_name,size,color,qty,unit_price,line_total").order("created_at", { ascending: true }),
  ]);
  return <OrdersManager orders={(orders || []) as Order[]} items={(items || [])}/>;
}

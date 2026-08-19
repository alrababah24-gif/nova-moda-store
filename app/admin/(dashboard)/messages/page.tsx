import { MessagesManager } from "@/components/admin/messages-manager";
import { requireAdmin } from "@/lib/auth";

export default async function AdminMessagesPage() {
  const { supabase } = await requireAdmin("customers");
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  return <MessagesManager messages={data || []}/>;
}

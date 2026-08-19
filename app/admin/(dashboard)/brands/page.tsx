import { BrandsManager } from "@/components/admin/brands-manager";
import { requireAdmin } from "@/lib/auth";
import type { Brand } from "@/lib/types";
export default async function AdminBrandsPage(){const {supabase}=await requireAdmin("catalog");const {data}=await supabase.from("brands").select("*").order("sort_order");return <BrandsManager brands={(data||[]) as Brand[]}/>;}

import { TeamManager } from "@/components/admin/team-manager";
import { permissionsForProfile, requireAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export default async function AdminTeamPage(){
  const{supabase}=await requireAdmin("staff");
  const{data}=await supabase.from("profiles").select("id,email,full_name,role,permissions,created_at").in("role",["owner","admin","editor"]).order("created_at");
  const staff=((data||[]) as Profile[]).map(p=>({...p,permissions:permissionsForProfile(p)}));
  return <TeamManager staff={staff}/>;
}

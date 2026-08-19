"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfiguredClient } from "@/lib/supabase/client";

export function RealtimeStoreSync(){
  const router=useRouter();
  useEffect(()=>{
    if(!isSupabaseConfiguredClient()) return;
    const supabase=createClient(); if(!supabase) return;
    let timer:ReturnType<typeof setTimeout>|null=null;
    const refresh=()=>{if(timer)clearTimeout(timer);timer=setTimeout(()=>router.refresh(),180)};
    const channel=supabase.channel("nova-public-store-sync")
      .on("postgres_changes",{event:"*",schema:"public",table:"products"},refresh)
      .on("postgres_changes",{event:"*",schema:"public",table:"brands"},refresh)
      .on("postgres_changes",{event:"*",schema:"public",table:"categories"},refresh)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"store_settings"},refresh)
      .subscribe();
    return()=>{if(timer)clearTimeout(timer);void supabase.removeChannel(channel)};
  },[router]);
  return null;
}

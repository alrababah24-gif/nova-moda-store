"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tags, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router=useRouter(); const [name,setName]=useState(""); const [error,setError]=useState("");
  async function add(){if(!name.trim())return;const supabase=createClient();if(!supabase)return;const {error}=await supabase.from("categories").insert({name:name.trim(),slug:slugify(name),sort_order:Math.max(0,...categories.map(c=>c.sort_order))+1,active:true});if(error)setError(error.message);else{setName("");setError("");router.refresh();}}
  async function toggle(category:Category){const supabase=createClient();if(!supabase)return;const {error}=await supabase.from("categories").update({active:!category.active}).eq("id",category.id);if(error)setError(error.message);else router.refresh();}
  async function remove(category:Category){if(category.slug==="all")return;if(!confirm(`حذف قسم ${category.name}؟ المنتجات ستبقى بدون قسم.`))return;const supabase=createClient();if(!supabase)return;const {error}=await supabase.from("categories").delete().eq("id",category.id);if(error)setError(error.message);else router.refresh();}
  return <section className="rounded-2xl border border-[#E6D8CE] bg-white p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2"><Tags size={17}/><h2 className="text-xl font-extrabold">أقسام المنتجات</h2></div><p className="mt-1 text-xs text-[#8C7A72]">أضيفي أقسام جديدة وفعّلي أو أخفي الأقسام من المتجر.</p></div><div className="flex w-full gap-2 lg:max-w-md"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} className="admin-input" placeholder="مثال: عبايات شتوية"/><button onClick={add} className="flex shrink-0 items-center gap-1 rounded-full bg-[#3D2B24] px-4 text-xs font-extrabold text-white"><Plus size={13}/>إضافة</button></div></div>{error&&<p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}<div className="mt-5 flex flex-wrap gap-2">{categories.map(category=><div key={category.id} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${category.active?"border-[#DCCABD] bg-[#FDF6F0]":"border-[#EAE1DA] bg-white text-[#9B8B83]"}`}><button onClick={()=>toggle(category)} title={category.active?"إخفاء القسم":"إظهار القسم"}>{category.name}</button>{category.slug!=="all"&&<button onClick={()=>remove(category)} className="text-red-500" aria-label={`حذف ${category.name}`}><Trash2 size={11}/></button>}</div>)}</div></section>;
}

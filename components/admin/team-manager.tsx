"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Plus, ShieldCheck, UserCog, UserMinus } from "lucide-react";
import type { Profile, StaffPermissions, StaffRole } from "@/lib/types";

type StaffProfile = Profile & { permissions?: StaffPermissions | null };
const roleName:Record<StaffRole,string>={customer:"عميل",editor:"محرر",admin:"مدير",owner:"المالك"};
const permissionLabels:Record<keyof StaffPermissions,string>={catalog:"المنتجات والبراندات",orders:"الطلبات",content:"المحتوى",customers:"العملاء والرسائل",settings:"الإعدادات",staff:"إدارة الفريق"};
const defaultFor=(role:"editor"|"admin"):StaffPermissions=>role==="admin"?{catalog:true,orders:true,content:true,customers:true,settings:true,staff:false}:{catalog:true,orders:false,content:true,customers:false,settings:false,staff:false};

export function TeamManager({staff}:{staff:StaffProfile[]}){
  const router=useRouter();
  const[open,setOpen]=useState(false);
  const[role,setRole]=useState<"editor"|"admin">("editor");
  const[permissions,setPermissions]=useState<StaffPermissions>(defaultFor("editor"));
  const[saving,setSaving]=useState(false);
  const[message,setMessage]=useState("");

  function changeRole(next:"editor"|"admin"){setRole(next);setPermissions(defaultFor(next));}
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setSaving(true);setMessage("");
    const data=new FormData(e.currentTarget);
    const response=await fetch("/api/admin/staff",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({fullName:String(data.get("fullName")||""),email:String(data.get("email")||""),password:String(data.get("password")||""),role,permissions})});
    const body=await response.json().catch(()=>({}));setSaving(false);
    if(!response.ok){setMessage(body.error||"تعذر إنشاء الحساب");return;}
    setMessage("تم إنشاء حساب الإدارة. يقدر الشخص يسجل من /admin/login مباشرة.");e.currentTarget.reset();setOpen(false);router.refresh();
  }
  async function revoke(id:string){if(!confirm("إلغاء صلاحيات الإدارة لهذا الحساب؟"))return;const response=await fetch("/api/admin/staff",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,role:"customer",permissions:{}})});if(response.ok)router.refresh();else setMessage("تعذر تعديل الحساب.");}

  return <div className="space-y-5">
    <section className="rounded-[28px] bg-[#3D2B24] p-6 text-white sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#DDBCA6]">ACCESS CONTROL</p><h1 className="mt-2 text-3xl font-extrabold">فريق الإدارة</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">اعملي لكل شخص حسابه الخاص بدل مشاركة كلمة مرور واحدة. كل دور يظهر له فقط الأدوات المسموح بها.</p></div><button onClick={()=>setOpen(v=>!v)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-extrabold text-[#3D2B24]"><Plus size={16}/>حساب إدارة جديد</button></div></section>

    {open&&<form onSubmit={submit} className="rounded-[24px] border border-[#DCCABD] bg-white p-5 soft-shadow sm:p-6"><div className="mb-5"><h2 className="text-xl font-extrabold">إنشاء حساب موظف</h2><p className="mt-2 text-xs leading-6 text-[#8C7A72]">أعطيه كلمة مرور مؤقتة، وبعدها يقدر يدخل من صفحة الإدارة.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">الاسم<input name="fullName" required className="admin-input mt-2"/></label><label className="text-xs font-bold">البريد الإلكتروني<input name="email" type="email" required className="admin-input mt-2" dir="ltr"/></label><label className="text-xs font-bold">كلمة مرور مؤقتة<input name="password" type="password" minLength={8} required className="admin-input mt-2" dir="ltr"/></label><label className="text-xs font-bold">الدور<select value={role} onChange={e=>changeRole(e.target.value as "editor"|"admin")} className="admin-input mt-2"><option value="editor">محرر — منتجات ومحتوى</option><option value="admin">مدير — أغلب أقسام المتجر</option></select></label></div><div className="mt-5 rounded-2xl bg-[#FDF6F0] p-4"><p className="mb-3 text-xs font-extrabold">الصلاحيات</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{(Object.keys(permissionLabels) as (keyof StaffPermissions)[]).filter(k=>k!=="staff").map(key=><label key={key} className="flex items-center gap-2 rounded-xl bg-white p-3 text-[11px] font-bold"><input type="checkbox" checked={Boolean(permissions[key])} onChange={e=>setPermissions({...permissions,[key]:e.target.checked})}/>{permissionLabels[key]}</label>)}</div></div><div className="mt-5 flex items-center gap-3"><button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#3D2B24] px-6 text-xs font-extrabold text-white">{saving?<Loader2 size={14} className="animate-spin"/>:<KeyRound size={14}/>}إنشاء الحساب</button><button type="button" onClick={()=>setOpen(false)} className="text-xs font-bold text-[#8C7A72]">إلغاء</button></div></form>}

    {message&&<div className="rounded-2xl border border-[#E6D8CE] bg-white p-4 text-xs font-bold">{message}</div>}
    <section className="rounded-[24px] border border-[#E6D8CE] bg-white p-5 sm:p-6"><div><h2 className="text-xl font-extrabold">الحسابات الإدارية</h2><p className="mt-1 text-xs text-[#8C7A72]">كل شخص يدخل بحسابه الخاص.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{staff.map(person=><article key={person.id} className="rounded-2xl border border-[#EEE1D7] p-4"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6EBE3] text-[#805B4C]"><UserCog size={18}/></span><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{person.full_name||person.email||"حساب إدارة"}</strong><span className="rounded-full bg-[#FDF6F0] px-2 py-1 text-[9px] font-extrabold">{roleName[person.role]}</span></div><p className="mt-1 text-[10px] text-[#8C7A72]" dir="ltr">{person.email}</p></div></div>{person.role!=="owner"&&<button onClick={()=>revoke(person.id)} className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600" title="إلغاء صلاحيات الإدارة"><UserMinus size={14}/></button>}</div><div className="mt-4 flex flex-wrap gap-1.5">{(Object.keys(permissionLabels) as (keyof StaffPermissions)[]).filter(k=>person.permissions?.[k]).map(k=><span key={k} className="inline-flex items-center gap-1 rounded-full bg-[#F7ECE4] px-2.5 py-1 text-[9px] font-bold"><ShieldCheck size={9}/>{permissionLabels[k]}</span>)}</div></article>)}</div>{!staff.length&&<div className="py-12 text-center text-sm text-[#8C7A72]">بعد إنشاء حساب المالك ستظهر الحسابات هنا.</div>}</section>
  </div>;
}

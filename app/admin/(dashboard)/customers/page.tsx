import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export default async function AdminCustomersPage(){
  const {supabase}=await requireAdmin("customers");
  const {data}=await supabase.from("profiles").select("id,email,full_name,phone,city,role,marketing_consent,marketing_consent_at,created_at").eq("role","customer").order("created_at",{ascending:false});
  const customers=(data||[]) as Profile[];
  const consent=customers.filter(c=>c.marketing_consent).length;
  return <div className="space-y-5">
    <section className="rounded-[28px] bg-[#3D2B24] p-6 text-white sm:p-8"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#DDBCA6]">CUSTOMER DATA</p><h1 className="mt-2 text-3xl font-extrabold">العملاء المسجلون</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">البريد وبيانات الحساب تحفظ مع العميل. التسويق منفصل: فقط من فعّل خيار استقبال العروض يظهر بموافقة تسويقية.</p><div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-2">{customers.length} حساب</span><span className="rounded-full bg-white/10 px-3 py-2">{consent} موافق على العروض</span></div></section>
    <section className="overflow-hidden rounded-[24px] border border-[#E6D8CE] bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-right text-xs"><thead className="bg-[#FDF6F0] text-[#8C7A72]"><tr><th className="p-4">العميل</th><th className="p-4">الهاتف</th><th className="p-4">المدينة</th><th className="p-4">العروض</th><th className="p-4">تاريخ التسجيل</th></tr></thead><tbody>{customers.map(c=><tr key={c.id} className="border-t border-[#F0E6DC]"><td className="p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#F6EBE3]"><UserRound size={15}/></span><div><strong className="block text-sm">{c.full_name||"بدون اسم"}</strong><span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#8C7A72]"><Mail size={10}/>{c.email||"—"}</span></div></div></td><td className="p-4"><span className="inline-flex items-center gap-1"><Phone size={11}/>{c.phone||"—"}</span></td><td className="p-4">{c.city||"—"}</td><td className="p-4">{c.marketing_consent?<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700"><ShieldCheck size={11}/>موافق</span>:<span className="text-[#8C7A72]">غير مشترك</span>}</td><td className="p-4 text-[#8C7A72]">{c.created_at?new Date(c.created_at).toLocaleDateString("ar-JO"):"—"}</td></tr>)}</tbody></table>{customers.length===0&&<div className="p-12 text-center text-sm text-[#8C7A72]">لا توجد حسابات عملاء بعد.</div>}</div></section>
  </div>;
}

"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { createClient, isSupabaseConfiguredClient } from "@/lib/supabase/client";

export function AdminLoginForm({ setup, unauthorized }: { setup: boolean; unauthorized: boolean }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(unauthorized ? "هذا الحساب لا يملك صلاحية الإدارة." : "");
  const configured = isSupabaseConfiguredClient();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createClient();
    if (!supabase) { setError("أكملي إعداد Supabase أولاً من ملف README.md"); setLoading(false); return; }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError("بيانات الدخول غير صحيحة أو الحساب غير مفعل."); setLoading(false); return; }
    router.replace("/admin"); router.refresh();
  }

  return <div className="min-h-screen bg-[#FDF6F0] px-4 py-10 surface-grid"><div className="mx-auto max-w-[440px] rounded-[30px] border border-[#E7D6C9] bg-[#FFFBF7]/95 p-6 card-shadow sm:p-8"><Image src="/brand/nova-moda-logo.png" alt="نوفا مودا" width={260} height={300} priority className="mx-auto h-28 w-auto object-contain"/><div className="mt-3 text-center"><div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#F2E2D7]"><LockKeyhole size={18}/></div><h1 className="text-2xl font-extrabold">لوحة إدارة نوفا مودا</h1><p className="mt-2 text-sm leading-7 text-[#806B61]">دخول آمن عبر Supabase Auth. لا توجد كلمات مرور محفوظة في المتصفح.</p></div>{(setup || !configured) && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">لوحة الإدارة تحتاج ربط Supabase. افتحي <strong>README.md</strong> وشغّلي ملفات SQL ثم ضعي مفاتيح المشروع داخل <strong>.env.local</strong>.</div>}<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-bold">البريد الإلكتروني<input type="email" name="email" required className="admin-input mt-2" placeholder="admin@novamoda.com"/></label><label className="block text-sm font-bold">كلمة المرور<div className="relative mt-2"><input type={show?"text":"password"} name="password" required className="admin-input pl-12"/><button type="button" onClick={()=>setShow(!show)} className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full" aria-label="إظهار كلمة المرور">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>{error && <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</div>}<button disabled={loading || !configured} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-5 text-sm font-extrabold text-white disabled:opacity-45">{loading?<><Loader2 size={16} className="animate-spin"/>جاري الدخول...</>:"دخول لوحة الإدارة"}</button></form><a href="/" className="mt-5 block text-center text-xs font-bold text-[#8C7A72]">العودة للمتجر ←</a></div></div>;
}

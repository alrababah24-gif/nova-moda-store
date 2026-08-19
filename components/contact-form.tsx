"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function ContactForm({ databaseReady }: { databaseReady: boolean }) {
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!databaseReady) { setState("success"); setMessage("تم تجهيز النموذج. بعد ربط قاعدة البيانات سيتم حفظ الرسائل في لوحة الإدارة."); form.reset(); return; }
    setState("loading");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name:data.get("name"), phone:data.get("phone"), message:data.get("message"), company:data.get("company") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر الإرسال");
      setState("success"); setMessage("وصلتنا رسالتك، وسنتواصل معك بأقرب وقت."); form.reset();
    } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "تعذر الإرسال"); }
  }

  return <form onSubmit={submit} className="rounded-[26px] border border-[#EEDFD4] bg-white p-5 soft-shadow sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">الاسم<input required name="name" className="admin-input mt-2"/></label><label className="text-sm font-bold">رقم الهاتف<input required name="phone" inputMode="tel" className="admin-input mt-2"/></label></div><label className="mt-4 block text-sm font-bold">رسالتك<textarea required name="message" rows={6} className="admin-input mt-2 resize-none"/></label><input name="company" className="hidden" tabIndex={-1} autoComplete="off"/><button disabled={state==="loading"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-6 text-sm font-extrabold text-white">{state==="loading"?<><Loader2 size={16} className="animate-spin"/>جاري الإرسال...</>:<><Send size={16}/>إرسال الرسالة</>}</button>{message && <div className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${state==="error"?"bg-red-50 text-red-700":"bg-emerald-50 text-emerald-800"}`}>{state!=="error" && <CheckCircle2 size={17} className="mt-0.5 shrink-0"/>}{message}</div>}</form>;
}

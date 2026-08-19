"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return <div className="space-y-3">{faqs.map((faq)=><div key={faq.id} className="overflow-hidden rounded-2xl border border-[#EADCD1] bg-white"><button onClick={()=>setOpen(open===faq.id?null:faq.id)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right"><strong className="text-sm leading-6 sm:text-[15px]">{faq.question}</strong><ChevronDown size={18} className={`shrink-0 transition ${open===faq.id?"rotate-180":""}`}/></button>{open===faq.id && <div className="border-t border-[#F0E6DC] px-5 py-4 text-sm leading-8 text-[#6F5B52]">{faq.answer}</div>}</div>)}</div>;
}

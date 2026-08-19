"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LogIn, LogOut, PackageSearch, Settings2, UserRound, UserRoundPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/components/account/account-provider";

export function AccountMenu() {
  const { user, loading, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);

  if (loading) return <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--surface-soft)]"/>;
  if (!user) return <Link href="/login" className="account-trigger" aria-label="تسجيل الدخول"><UserRound size={18}/><span className="hidden lg:inline">دخول</span></Link>;

  return <div ref={ref} className="relative"><button onClick={() => setOpen(v => !v)} className="account-trigger" aria-expanded={open}><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)]"><UserRound size={15}/></span><span className="hidden max-w-[110px] truncate text-[11px] font-extrabold sm:inline">{user.fullName.split(" ")[0]}</span></button><AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.18}} className="account-popover"><div className="border-b border-[var(--line)] p-4"><p className="text-[10px] font-extrabold tracking-[.16em] text-[var(--brand-strong)]">NOVA ACCOUNT</p><p className="mt-1 text-sm font-extrabold">{user.fullName}</p><p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">{user.email}</p></div><div className="p-2"><Link href="/account" onClick={()=>setOpen(false)} className="account-menu-item"><UserRoundPen size={15}/>حسابي</Link><Link href="/account/orders" onClick={()=>setOpen(false)} className="account-menu-item"><PackageSearch size={15}/>طلباتي</Link><Link href="/account/profile" onClick={()=>setOpen(false)} className="account-menu-item"><Settings2 size={15}/>تحرير الملف</Link><button onClick={async()=>{await signOut();setOpen(false)}} className="account-menu-item w-full text-red-600 dark:text-red-400"><LogOut size={15}/>تسجيل خروج</button></div></motion.div>}</AnimatePresence></div>;
}

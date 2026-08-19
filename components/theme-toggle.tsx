"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ compact=false }:{compact?:boolean}){
  const [dark,setDark]=useState(false);
  useEffect(()=>{setDark(document.documentElement.classList.contains("dark"));},[]);
  function toggle(){const next=!dark;setDark(next);document.documentElement.classList.toggle("dark",next);localStorage.setItem("nova-theme",next?"dark":"light");}
  return <button onClick={toggle} aria-label={dark?"تفعيل الوضع الفاتح":"تفعيل الوضع الداكن"} title={dark?"الوضع الفاتح":"الوضع الداكن"} className={`theme-control inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] transition hover:-translate-y-0.5 ${compact?"h-10 w-10":"h-11 gap-2 px-4"}`}>{dark?<Sun size={17}/>:<Moon size={17}/>} {!compact&&<span className="text-xs font-extrabold">{dark?"فاتح":"داكن"}</span>}</button>
}

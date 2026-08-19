"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfiguredClient } from "@/lib/supabase/client";

export type AccountUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  address?: string;
  avatarUrl?: string;
  demo?: boolean;
};

type RegisterInput = { fullName: string; email: string; password: string; phone?: string; marketingConsent?: boolean };
type ProfileInput = { fullName: string; phone: string; city: string; address: string };
type AccountContextValue = {
  user: AccountUser | null;
  loading: boolean;
  databaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  register: (input: RegisterInput) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (input: ProfileInput) => Promise<{ error?: string }>;
  refresh: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);
const demoKey = "nova-moda-demo-account";

function readDemo(): AccountUser | null {
  try {
    const value = localStorage.getItem(demoKey);
    return value ? (JSON.parse(value) as AccountUser) : null;
  } catch { return null; }
}

async function fetchProfile(userId: string, email: string): Promise<AccountUser> {
  const supabase = createClient();
  if (!supabase) return { id: userId, email, fullName: email.split("@")[0] || "عميلة نوفا" };
  const { data } = await supabase.from("profiles").select("full_name,phone,city,address,avatar_url").eq("id", userId).maybeSingle();
  return {
    id: userId,
    email,
    fullName: data?.full_name || email.split("@")[0] || "عميلة نوفا",
    phone: data?.phone || "",
    city: data?.city || "",
    address: data?.address || "",
    avatarUrl: data?.avatar_url || "",
  };
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const databaseReady = isSupabaseConfiguredClient();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!databaseReady) {
      setUser(readDemo());
      setLoading(false);
      return;
    }
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) { setUser(null); setLoading(false); return; }
    setUser(await fetchProfile(authUser.id, authUser.email || ""));
    setLoading(false);
  }, [databaseReady]);

  useEffect(() => {
    void refresh();
    if (!databaseReady) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data: subscription } = supabase.auth.onAuthStateChange(() => { void refresh(); });
    return () => subscription.subscription.unsubscribe();
  }, [databaseReady, refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!databaseReady) {
      if (!email.trim() || password.length < 4) return { error: "اكتبي البريد وكلمة مرور من 4 خانات على الأقل للمعاينة." };
      const demo: AccountUser = { id: "demo-customer", email: email.trim(), fullName: "سارة أحمد", phone: "0790000000", city: "عمّان", address: "الشميساني - عمّان", demo: true };
      localStorage.setItem(demoKey, JSON.stringify(demo)); setUser(demo); return {};
    }
    const supabase = createClient(); if (!supabase) return { error: "تعذر الاتصال بنظام الحسابات." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    await refresh(); return {};
  }, [databaseReady, refresh]);

  const register = useCallback(async (input: RegisterInput) => {
    if (!databaseReady) {
      const demo: AccountUser = { id: "demo-customer", email: input.email.trim(), fullName: input.fullName.trim() || "عميلة نوفا", phone: input.phone || "", city: "", address: "", demo: true };
      localStorage.setItem(demoKey, JSON.stringify(demo)); setUser(demo); return { message: "تم إنشاء حساب المعاينة بنجاح." };
    }
    const supabase = createClient(); if (!supabase) return { error: "تعذر الاتصال بنظام الحسابات." };
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { full_name: input.fullName, phone: input.phone || "", marketing_consent: Boolean(input.marketingConsent) }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { error: error.message.includes("registered") ? "هذا البريد مسجل مسبقاً." : "تعذر إنشاء الحساب حالياً." };
    return { message: "تم إنشاء الحساب. إذا كان تأكيد البريد مفعلاً، راجعي بريدك لإكمال التسجيل." };
  }, [databaseReady]);

  const signOut = useCallback(async () => {
    if (!databaseReady) { localStorage.removeItem(demoKey); setUser(null); return; }
    const supabase = createClient(); if (supabase) await supabase.auth.signOut(); setUser(null);
  }, [databaseReady]);

  const updateProfile = useCallback(async (input: ProfileInput) => {
    if (!user) return { error: "سجلي الدخول أولاً." };
    if (!databaseReady) {
      const next = { ...user, fullName: input.fullName, phone: input.phone, city: input.city, address: input.address };
      localStorage.setItem(demoKey, JSON.stringify(next)); setUser(next); return {};
    }
    const supabase = createClient(); if (!supabase) return { error: "تعذر الاتصال بنظام الحسابات." };
    const { error } = await supabase.from("profiles").update({ full_name: input.fullName, phone: input.phone, city: input.city, address: input.address }).eq("id", user.id);
    if (error) return { error: "تعذر حفظ البيانات. حاولي مرة ثانية." };
    await refresh(); return {};
  }, [databaseReady, refresh, user]);

  const value = useMemo(() => ({ user, loading, databaseReady, signIn, register, signOut, updateProfile, refresh }), [user, loading, databaseReady, signIn, register, signOut, updateProfile, refresh]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used within AccountProvider");
  return value;
}

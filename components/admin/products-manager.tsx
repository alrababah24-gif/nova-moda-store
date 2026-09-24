"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { Brand, Category, Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/media-upload";
import { formatPrice, slugify } from "@/lib/utils";

type Draft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string;
  category_id: string;
  brand_id: string;
  badge: string;
  sizes: string;
  colors: string;
  images: string[];
  stock: string;
  featured: boolean;
  active: boolean;
};

const blank: Draft = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compare_at_price: "",
  category_id: "",
  brand_id: "",
  badge: "",
  sizes: "S,M,L,XL",
  colors: "",
  images: [],
  stock: "10",
  featured: true,
  active: true,
};

export function ProductsManager({ products, categories, brands }: { products: Product[]; categories: Category[]; brands: Brand[] }) {
  const router = useRouter();
  const editorRef = useRef<HTMLElement>(null);
  const [draft, setDraft] = useState<Draft>(blank);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.brand?.name || ""}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  function revealEditor() {
    setEditorOpen(true);
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function addNew() {
    setDraft(blank);
    setMessage("");
    revealEditor();
  }

  function edit(p: Product) {
    setDraft({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      category_id: p.category_id || "",
      brand_id: p.brand_id || "",
      badge: p.badge || "",
      sizes: p.sizes.join(","),
      colors: p.colors.join(","),
      images: p.images,
      stock: String(p.stock),
      featured: p.featured,
      active: p.active,
    });
    setMessage("");
    revealEditor();
  }

  function closeEditor() {
    setDraft(blank);
    setMessage("");
    setEditorOpen(false);
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []) as File[];
    if (!files.length) return;
    setUploading(true);
    setMessage("");
    try {
      const urls: string[] = [];
      for (const file of files.slice(0, 8 - draft.images.length)) {
        urls.push(await uploadMedia(file, "products"));
      }
      setDraft((d) => ({ ...d, images: [...d.images, ...urls] }));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "فشل رفع الصور");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function save() {
    if (!draft.name.trim() || !draft.price) {
      setMessage("الاسم والسعر مطلوبان");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    setSaving(true);
    setMessage("");
    const payload = {
      name: draft.name.trim(),
      slug: (draft.slug || slugify(draft.name)).trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      compare_at_price: draft.compare_at_price ? Number(draft.compare_at_price) : null,
      category_id: draft.category_id || null,
      brand_id: draft.brand_id || null,
      badge: draft.badge.trim() || null,
      sizes: draft.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: draft.colors.split(",").map((s) => s.trim()).filter(Boolean),
      images: draft.images,
      stock: Number(draft.stock || 0),
      featured: draft.featured,
      active: draft.active,
      updated_at: new Date().toISOString(),
    };
    const result = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (result.error) setMessage(result.error.message);
    else {
      setMessage("تم الحفظ والنشر على المتجر مباشرة.");
      setDraft(blank);
      router.refresh();
      window.setTimeout(() => setEditorOpen(false), 650);
    }
  }

  async function remove(id: string) {
    if (!confirm("حذف المنتج نهائياً؟")) return;
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) setMessage(error.message);
    else router.refresh();
  }

  return <div className="space-y-5">
    <section className="rounded-[26px] border border-[#E6D8CE] bg-white p-5 soft-shadow sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-extrabold tracking-[.18em] text-[#A27E6C]">CATALOG STUDIO</p>
          <h1 className="mt-1 text-2xl font-extrabold">المنتجات</h1>
          <p className="mt-2 text-xs leading-6 text-[#8C7A72]">أضيفي القطعة مرة واحدة، وبعد الحفظ تظهر بنفس تقسيمة المتجر تلقائياً.</p>
        </div>
        <button onClick={addNew} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-6 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5">
          <Plus size={17}/> إضافة منتج
        </button>
      </div>
    </section>

    {editorOpen && <section ref={editorRef} className="product-editor-panel rounded-[26px] border border-[#DCCABD] bg-white p-5 soft-shadow sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold text-[#A27E6C]">{draft.id ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
          <h2 className="mt-1 text-2xl font-extrabold">{draft.id ? "تعديل المنتج" : "منتج جديد"}</h2>
          <p className="mt-2 text-[11px] leading-5 text-[#8C7A72]">الصورة، الاسم، السعر والتفاصيل كفاية للنشر. باقي الحقول اختيارية حسب القطعة.</p>
        </div>
        <button onClick={closeEditor} className="grid h-10 w-10 place-items-center rounded-full border border-[#E6D8CE]" aria-label="إغلاق"><X size={16}/></button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="اسم المنتج" className="xl:col-span-2"><input className="admin-input mt-2" value={draft.name} onChange={(e)=>setDraft({...draft,name:e.target.value,slug:draft.id?draft.slug:slugify(e.target.value)})}/></Field>
        <Field label="السعر"><input type="number" step="0.01" className="admin-input mt-2" value={draft.price} onChange={(e)=>setDraft({...draft,price:e.target.value})}/></Field>
        <Field label="السعر قبل الخصم"><input type="number" step="0.01" className="admin-input mt-2" value={draft.compare_at_price} onChange={(e)=>setDraft({...draft,compare_at_price:e.target.value})}/></Field>
        <Field label="رابط المنتج" className="xl:col-span-2"><input dir="ltr" className="admin-input mt-2 text-left" value={draft.slug} onChange={(e)=>setDraft({...draft,slug:e.target.value})}/></Field>
        <Field label="البراند"><select className="admin-input mt-2" value={draft.brand_id} onChange={(e)=>setDraft({...draft,brand_id:e.target.value})}><option value="">بدون براند</option>{brands.filter((b)=>b.active).map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
        <Field label="القسم"><select className="admin-input mt-2" value={draft.category_id} onChange={(e)=>setDraft({...draft,category_id:e.target.value})}><option value="">بدون قسم</option>{categories.filter((c)=>c.slug!=="all").map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="شارة المنتج"><input className="admin-input mt-2" placeholder="جديد / حصري" value={draft.badge} onChange={(e)=>setDraft({...draft,badge:e.target.value})}/></Field>
        <Field label="المقاسات"><input className="admin-input mt-2" placeholder="S,M,L,XL" value={draft.sizes} onChange={(e)=>setDraft({...draft,sizes:e.target.value})}/></Field>
        <Field label="الألوان"><input className="admin-input mt-2" placeholder="أسود، بيج..." value={draft.colors} onChange={(e)=>setDraft({...draft,colors:e.target.value})}/></Field>
        <Field label="المخزون"><input type="number" className="admin-input mt-2" value={draft.stock} onChange={(e)=>setDraft({...draft,stock:e.target.value})}/></Field>
        <Field label="الوصف" className="sm:col-span-2 xl:col-span-4"><textarea rows={4} className="admin-input mt-2 resize-none" value={draft.description} onChange={(e)=>setDraft({...draft,description:e.target.value})}/></Field>
      </div>

      <div className="mt-5 rounded-2xl border border-[#EEE1D7] bg-[#FFFCF9] p-4">
        <div className="mb-3 flex items-center justify-between gap-3"><div><strong className="text-xs">صور المنتج ({draft.images.length}/8)</strong><p className="mt-1 text-[10px] text-[#8C7A72]">الصورة الأولى هي الغلاف.</p></div><label className="flex cursor-pointer items-center gap-2 rounded-full border border-[#DDCBBE] bg-white px-4 py-2 text-xs font-bold"><ImagePlus size={14}/>{uploading?"جاري الرفع...":"اختيار الصور"}<input type="file" accept="image/*" multiple hidden onChange={upload} disabled={uploading||draft.images.length>=8}/></label></div>
        <div className="flex flex-wrap gap-3">{draft.images.map((url,i)=><div key={`${url}-${i}`} className="relative h-32 w-24 overflow-hidden rounded-xl border border-[#E6D8CE] bg-[#FDF6F0]"><Image src={url} alt={`صورة ${i+1}`} fill className="object-cover" sizes="96px"/><span className="absolute bottom-1 right-1 rounded-full bg-black/65 px-2 py-0.5 text-[8px] font-bold text-white">{i===0?"غلاف":i+1}</span><button onClick={()=>setDraft({...draft,images:draft.images.filter((_,n)=>n!==i)})} className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-red-600"><X size={12}/></button></div>)}</div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={draft.featured} onChange={(e)=>setDraft({...draft,featured:e.target.checked})}/> يظهر في الرئيسية</label>
        <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={draft.active} onChange={(e)=>setDraft({...draft,active:e.target.checked})}/> منشور للزبائن</label>
        <button onClick={save} disabled={saving||uploading} className="mr-auto flex min-h-11 items-center gap-2 rounded-full bg-[#3D2B24] px-7 text-xs font-extrabold text-white disabled:opacity-50">{saving?<Loader2 size={14} className="animate-spin"/>:<Plus size={14}/>} {draft.id?"حفظ التعديلات":"نشر المنتج"}</button>
      </div>
      {message&&<div className="mt-4 rounded-xl bg-[#FDF6F0] p-3 text-xs font-bold">{message}</div>}
    </section>}

    <section className="rounded-[26px] border border-[#E6D8CE] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-extrabold">كل المنتجات</h2><p className="mt-1 text-xs text-[#8C7A72]">{products.length} منتج — اضغطي + لإضافة قطعة جديدة</p></div><div className="relative"><Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A72]"/><input value={search} onChange={(e)=>setSearch(e.target.value)} className="admin-input pr-9 sm:w-72" placeholder="بحث بالاسم أو البراند..."/></div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <button onClick={addNew} className="admin-add-product-card"><span className="admin-add-product-plus"><Plus size={25}/></span><strong className="text-sm">أضيفي منتج جديد</strong><span className="text-[10px] opacity-70">صورة • تفاصيل • سعر • نشر</span></button>
        {filtered.map((p)=><div key={p.id} className="flex min-h-[148px] gap-3 rounded-[22px] border border-[#EEE1D7] p-3"><div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FDF6F0]"><Image src={p.images[0]||"/products/abaya-classic-beige.svg"} alt={p.name} fill className="object-cover" sizes="96px"/></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-extrabold leading-6">{p.name}</p><p className="mt-1 text-[11px] font-bold text-[#A27E6C]">{p.brand?.name||"بدون براند"}</p><p className="mt-1 text-xs text-[#8C7A72]">{formatPrice(p.price)} • مخزون {p.stock}</p><div className="mt-3 flex gap-2"><button onClick={()=>edit(p)} className="flex items-center gap-1 rounded-full bg-[#F6EBE3] px-3 py-1.5 text-[11px] font-bold"><Pencil size={11}/>تعديل</button><button onClick={()=>remove(p.id)} className="grid h-7 w-7 place-items-center rounded-full bg-red-50 text-red-600"><Trash2 size={11}/></button></div></div></div>)}
      </div>
    </section>
  </div>;
}

function Field({label,className="",children}:{label:string;className?:string;children:React.ReactNode}) {
  return <label className={`text-xs font-bold ${className}`}>{label}{children}</label>;
}

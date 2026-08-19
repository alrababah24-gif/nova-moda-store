import { ContentManager } from "@/components/admin/content-manager";
import { fallbackAbout } from "@/data/fallback";
import { requireAdmin } from "@/lib/auth";
import type { AboutContent, Faq, Testimonial } from "@/lib/types";

export default async function AdminContentPage() {
  const { supabase } = await requireAdmin("content");
  const [{ data: aboutRow }, { data: faqs }, { data: testimonials }] = await Promise.all([
    supabase.from("page_content").select("content").eq("key", "about").maybeSingle(),
    supabase.from("faqs").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
  ]);
  const about = { ...fallbackAbout, ...((aboutRow?.content || {}) as Partial<AboutContent>) } as AboutContent;
  return <ContentManager about={about} faqs={(faqs || []) as Faq[]} testimonials={(testimonials || []) as Testimonial[]}/>;
}

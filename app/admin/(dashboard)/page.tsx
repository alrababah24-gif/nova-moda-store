import Link from "next/link";
import { ArrowLeft, Boxes, CircleDollarSign, MessageSquareText, PackageCheck, ShoppingBag, Tags } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { supabase, profile, permissions } = await requireAdmin();
  const [productsResult, brandsResult, ordersResult, messagesResult, deliveredResult, recentResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("id", { count: "exact", head: true }),
    permissions.orders ? supabase.from("orders").select("id", { count: "exact", head: true }) : Promise.resolve({count:0,data:null,error:null}),
    permissions.customers ? supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false) : Promise.resolve({count:0,data:null,error:null}),
    permissions.orders ? supabase.from("orders").select("total").eq("status", "تم التوصيل") : Promise.resolve({data:[],error:null}),
    permissions.orders ? supabase.from("orders").select("id,order_number,customer_name,total,status,created_at").order("created_at", { ascending: false }).limit(6) : Promise.resolve({data:[],error:null}),
  ]);
  const revenue = (deliveredResult.data || []).reduce((sum, row) => sum + Number(row.total || 0), 0);
  const cards = [
    permissions.catalog&&{ label:"البراندات", value:brandsResult.count||0, icon:Tags, href:"/admin/brands" },
    permissions.catalog&&{ label:"المنتجات", value:productsResult.count||0, icon:Boxes, href:"/admin/products" },
    permissions.orders&&{ label:"كل الطلبات", value:ordersResult.count||0, icon:PackageCheck, href:"/admin/orders" },
    permissions.customers&&{ label:"رسائل جديدة", value:messagesResult.count||0, icon:MessageSquareText, href:"/admin/messages" },
    permissions.orders&&{ label:"مبيعات مسلّمة", value:formatPrice(revenue), icon:CircleDollarSign, href:"/admin/orders" },
  ].filter(Boolean) as {label:string;value:string|number;icon:typeof Boxes;href:string}[];
  const mainHref=permissions.catalog?"/admin/products":permissions.content?"/admin/content":"/admin";
  return <div className="space-y-5"><section className="overflow-hidden rounded-[28px] bg-[#3D2B24] p-6 text-white sm:p-8"><p className="text-xs font-bold tracking-[.16em] text-[#DDBCA6]">NOVA MODA ADMIN</p><h1 className="mt-2 text-3xl font-extrabold">أهلاً {profile?.full_name || "بإدارة نوفا مودا"}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">كل حساب إداري يشوف فقط الأقسام المسموحة له. المنتجات المنشورة تظهر على المتجر مباشرة بعد الحفظ.</p><Link href={mainHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-extrabold text-[#3D2B24]">ابدأ من هنا <ArrowLeft size={14}/></Link></section>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map(({label,value,icon:Icon,href})=><Link key={label} href={href} className="rounded-2xl border border-[#E6D8CE] bg-white p-5 soft-shadow transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#8C7A72]">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></div><div className="grid h-11 w-11 place-items-center rounded-full bg-[#F7ECE4]"><Icon size={18}/></div></div></Link>)}</div>
    {permissions.orders&&<section className="rounded-2xl border border-[#E6D8CE] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-extrabold">آخر الطلبات</h2><p className="mt-1 text-xs text-[#8C7A72]">أحدث حركة داخل المتجر</p></div><Link href="/admin/orders" className="text-xs font-extrabold">عرض الكل</Link></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-right text-xs"><thead className="text-[#8C7A72]"><tr className="border-b border-[#EEE1D7]"><th className="pb-3">الطلب</th><th className="pb-3">العميلة</th><th className="pb-3">الحالة</th><th className="pb-3">الإجمالي</th><th className="pb-3">التاريخ</th></tr></thead><tbody>{(recentResult.data||[]).map(order=><tr key={order.id} className="border-b border-[#F4EBE4] last:border-0"><td className="py-4 font-extrabold">{order.order_number}</td><td>{order.customer_name}</td><td><span className="rounded-full bg-[#F7ECE4] px-2.5 py-1 font-bold">{order.status}</span></td><td className="font-bold">{formatPrice(Number(order.total))}</td><td className="text-[#8C7A72]">{new Date(order.created_at).toLocaleDateString("ar-JO")}</td></tr>)}</tbody></table>{!recentResult.data?.length&&<div className="grid place-items-center py-14 text-sm text-[#8C7A72]"><ShoppingBag className="mb-2" size={28}/>لا توجد طلبات بعد.</div>}</div></section>}</div>;
}

# Architecture — Nova Moda

## الهدف

واجهة متجر سريعة ومباشرة للعميلة، مع فصل واضح بين تجربة الشراء العامة ولوحة الإدارة الخاصة.

## Storefront

- `/` الرئيسية: Hero مختصر → منتجات مباشرة → نقاط ثقة → قصة البراند → آراء → FAQ → CTA.
- `/shop`: كل المنتجات مع فلترة حسب القسم.
- `/product/[slug]`: صور، السعر، الوصف، المقاس، اللون، المخزون، إضافة للسلة.
- `/checkout`: بيانات التوصيل، ملخص الطلب، إنشاء الطلب وفتح WhatsApp.
- `/about`, `/faq`, `/contact`.

## Admin

- `/admin/login`: Supabase Auth.
- `/admin`: KPIs وآخر الطلبات.
- `/admin/products`: منتجات + أقسام + رفع صور.
- `/admin/orders`: حالات الطلب والتفاصيل.
- `/admin/content`: About + FAQ + Testimonials.
- `/admin/messages`: رسائل Contact.
- `/admin/settings`: بيانات المتجر والهوية وHero والشعار.

## Data flow

### القراءة العامة
Server Components → `lib/data.ts` → Supabase. إذا Supabase غير مفعّل تستخدم الواجهة fallback content.

### الطلب
Checkout → `POST /api/orders` → Zod → Supabase service role → `create_store_order()` → Transaction داخل PostgreSQL → رقم الطلب → WhatsApp.

### الإدارة
Supabase Auth cookie → `requireAdmin()` → فحص `profiles.role` → Client mutations محمية بـ RLS.

## Security

- Service Role موجود على السيرفر فقط.
- RLS مفعل على الجداول.
- الطلب العام لا يملك صلاحية كتابة مباشرة للجداول.
- Admin CRUD يمر عبر authenticated user + `is_admin()`.
- أسعار الطلب لا تؤخذ من العميل.
- Admin routes موضوعة `noindex`.

## Performance

- App Router وServer Components للبيانات العامة.
- `next/image` للشعار وصور المنتجات.
- Animations خفيفة مع reduced-motion.
- لا توجد مكتبات State كبيرة؛ السلة Context صغير + localStorage.
- إعادة تحقق دورية للمتجر، وAdmin يستخدم refresh بعد mutation.

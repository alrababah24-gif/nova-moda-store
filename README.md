# Nova Moda 2030 — FINAL v5

متجر نوفا مودا النهائي قبل مرحلة الربط والنشر: Next.js + TypeScript + Tailwind + Motion + Supabase/PostgreSQL، عربي RTL وMobile First.

## ما تم تثبيته في FINAL v5

- إعادة بناء عرض الشعار في منتصف الهيدر مع **ملف Mark شفاف حقيقي**: `public/brand/nova-moda-mark-clean.png`.
- الشعار لا يستخدم `invert()` ولا يتحول للفضي؛ يحتفظ بألوانه الأصلية فوق Logo Plate دافئ في الوضعين.
- Dark Mode تمت مراجعته كنظام ألوان كامل: Black / Graphite / Silver مع Bridge لكل الأسطح القديمة في صفحات المتجر.
- Status Hub أعلى الموقع: توصيل، مفتوح/مغلق، وقت عمّان، التاريخ، طقس عمّان، Instagram وFacebook.
- الصفحة الرئيسية متعددة الأقسام والمنتجات والبراندات والصفحات منفصلة ومترابطة.
- حساب عميلة: Login/Register/Profile/Orders وتتبع حالة الطلب.
- صفحة Admin للمنتجات تحتوي **بطاقة + كبيرة**. الضغط عليها يفتح نموذج بسيط: صور، اسم، سعر، براند، قسم، مقاسات، ألوان، مخزون ووصف. الحفظ ينشر المنتج بدون لمس الكود.
- نظام فريق إدارة جاهز بثلاث درجات:
  - `owner`: المالك، كامل الصلاحيات وإدارة الفريق.
  - `admin`: المنتجات + الطلبات + المحتوى + العملاء + الإعدادات.
  - `editor`: المنتجات/البراندات + المحتوى فقط افتراضياً.
- لكل موظف حساب مستقل بدلاً من مشاركة كلمة مرور واحدة.
- صفحة `/admin/team` لإنشاء حساب موظف واختيار صلاحياته.
- صفحة `/admin/customers` لعرض حسابات العملاء والبريد والهاتف.
- بريد العميل يُحفظ في `profiles.email` بالإضافة إلى Supabase Auth.
- التسويق منفصل عن إنشاء الحساب: Checkbox اختياري `marketing_consent` في التسجيل حتى نعرف من وافق على استقبال العروض.
- RLS وحماية الصلاحيات: المستخدم العادي لا يستطيع ترقية نفسه إلى Admin من المتصفح.

## أهم صفحات المتجر

```text
/                         الرئيسية
/brands                   البراندات
/brands/[slug]            صفحة البراند
/shop                     كل العبايات
/collections              المجموعات
/product/[slug]           المنتج
/search                   البحث
/size-guide               المقاسات
/about                    من نحن
/contact                  التواصل
/login                    تسجيل الدخول
/register                 إنشاء حساب
/account                  حساب العميلة
/account/orders           طلباتي
/account/profile          تحرير الملف
/checkout                 إتمام الطلب
```

## لوحة الإدارة

```text
/admin                     Dashboard
/admin/brands              البراندات
/admin/products            المنتجات + زر الإضافة الكبير
/admin/orders              الطلبات
/admin/content             محتوى الموقع / FAQ / آراء
/admin/customers           بيانات العملاء
/admin/messages            رسائل العملاء
/admin/team                حسابات وصلاحيات فريق الإدارة
/admin/settings            الهوية والتوصيل والدوام والتواصل
```

## تشغيل المعاينة الآن

من CMD داخل مجلد `nova-moda-store`:

```bash
npm install
npm run dev
```

ثم:

```text
http://localhost:3000
```

المتجر يعمل Demo بدون قاعدة بيانات. الربط الحقيقي يبدأ عندما نعتمد التصميم.

## قاعدة البيانات — عند الانتقال للمرحلة التالية

### مشروع Supabase جديد

نفذ في SQL Editor:

```text
supabase/schema.sql
supabase/seed.sql
```

أنشئ حسابك من Authentication > Users، ثم افتح:

```text
supabase/make-admin.sql
```

واستبدل `YOUR_EMAIL@example.com` ببريدك. هذا يجعل حسابك `owner`.

### لو قاعدة v4 موجودة

نفذ بالترتيب الملفات القديمة الناقصة عند الحاجة، ثم:

```text
supabase/migrations/20260819_final_access_customer_upgrade.sql
```

## ملف البيئة

انسخ `.env.example` إلى `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` سري ويستخدم على السيرفر فقط لإنشاء حسابات فريق الإدارة. لا تضعه في متغير يبدأ بـ `NEXT_PUBLIC_`.

## كيف يعمل نشر منتج من Admin؟

1. الموظف يفتح `/admin/products`.
2. يضغط بطاقة **+ أضيفي منتج جديد**.
3. يرفع الصور ويكتب التفاصيل والسعر.
4. يضغط **نشر المنتج**.
5. المنتج يدخل PostgreSQL ويظهر في المتجر، بدون تعديل ملفات الموقع.
6. Supabase Realtime يحدّث المتجر المفتوح عند تغير الكتالوج.

## بيانات العملاء

- `auth.users`: هوية الدخول والبريد على مستوى Supabase Auth.
- `public.profiles`: الاسم، البريد، الهاتف، المدينة، العنوان، الدور، الصلاحيات وموافقة التسويق.
- `public.orders`: الطلبات وحالتها.
- صفحة Admin Customers تعرض البيانات التي يحتاجها فريق المتجر.
- لا يتم اعتبار إنشاء حساب موافقة تلقائية على الرسائل التسويقية؛ الموافقة الاختيارية مسجلة بشكل منفصل.

## فحص ما قبل النشر

بعد تثبيت الحزم:

```bash
npm run typecheck
npm run lint
npm run build
```

بعدها نربط Supabase ثم نرفع المشروع على الاستضافة والدومين.

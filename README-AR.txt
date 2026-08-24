NOVA MODA — ImageKit migration patch

هذا التحديث يعمل شيئين:
1) أي صورة جديدة من لوحة الإدارة تذهب إلى ImageKit بدل Supabase Storage.
2) أوامر لترحيل الصور القديمة من Supabase إلى ImageKit وتحديث روابطها في قاعدة البيانات.

الأوامر بعد استبدال الملفات:

npm run build
npm run media:migrate:dry
npm run media:migrate

بعد التأكد من الموقع:
npm run media:cleanup:supabase -- --confirm

للرجوع للروابط القديمة قبل حذف Supabase Storage:
npm run media:rollback -- --confirm

مهم: قاعدة بيانات Supabase والحسابات والطلبات لا يتم حذفها. التنظيف يخص ملفات Storage التي تم ترحيلها فقط.

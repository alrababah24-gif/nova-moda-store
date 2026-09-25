Nova Moda - Final Supabase Storage Cleanup

1) انسخ محتويات هذا الملف فوق مجلد المشروع.
2) Audit:
   node scripts/final-clean-supabase-storage.mjs
3) إذا أكد أن لا توجد روابط Supabase Storage مستخدمة:
   node scripts/final-clean-supabase-storage.mjs --confirm

السكربت يستهدف فقط:
- product-images
- brand-assets

ولا يحذف قاعدة البيانات أو Auth أو الطلبات أو المنتجات أو المخزون.

-- NOVA MODA starter content

insert into public.store_settings (
  id, store_name, top_bar_text, delivery_price, whatsapp, phone, address, hours, open_time, close_time,
  facebook, instagram, primary_color, background_color,
  hero_eyebrow, hero_title, hero_description, hero_primary_cta, hero_secondary_cta
) values (
  1, 'نوفا مودا', 'توصيل لجميع محافظات الأردن', 2, '962798960051', '0798960051',
  'عمّان - الأردن، والتوصيل لجميع المحافظات',
  'يومياً: 9 صباحاً - 10 مساءً', '09:00', '22:00',
  'https://www.facebook.com/share/1Ezy9h8qz9/', 'https://www.instagram.com/novamodaabaya',
  '#C19A7A', '#FFFBF7', 'NOVA MODA • AMMAN • MODEST FASHION', 'نوفا مودا — العباية عندنا حضور، مش مجرد قطعة.',
  'نختار القماش، القصّة والتفصيل كأن كل عباية هي توقيع شخصي. أناقة هادئة، هوية واضحة، وحضور يبان قبل الكلام.',
  'تسوّقي الآن', 'تواصلي واتساب'
) on conflict (id) do update set
  store_name=excluded.store_name, top_bar_text=excluded.top_bar_text, delivery_price=excluded.delivery_price,
  whatsapp=excluded.whatsapp, phone=excluded.phone, address=excluded.address, hours=excluded.hours, open_time=excluded.open_time, close_time=excluded.close_time,
  facebook=excluded.facebook, instagram=excluded.instagram, primary_color=excluded.primary_color,
  background_color=excluded.background_color, hero_eyebrow=excluded.hero_eyebrow, hero_title=excluded.hero_title,
  hero_description=excluded.hero_description, hero_primary_cta=excluded.hero_primary_cta, hero_secondary_cta=excluded.hero_secondary_cta;

insert into public.categories (id,name,slug,description,sort_order,active) values
('00000000-0000-4000-8000-000000000001','كل العبايات','all','كل موديلات نوفا مودا',0,true),
('00000000-0000-4000-8000-000000000002','عبايات يومية','daily','موديلات مريحة للاستخدام اليومي',1,true),
('00000000-0000-4000-8000-000000000003','مناسبات','formal','تصاميم أنيقة للمناسبات',2,true),
('00000000-0000-4000-8000-000000000004','عبايات مفتوحة','open','قصات مفتوحة سهلة التنسيق',3,true),
('00000000-0000-4000-8000-000000000005','وصل حديثاً','new','أحدث إضافات نوفا مودا',4,true)
on conflict (id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,sort_order=excluded.sort_order,active=excluded.active;

insert into public.products (id,name,slug,description,price,compare_at_price,category_id,badge,sizes,colors,images,stock,featured,active) values
('10000000-0000-4000-8000-000000000001','عباية كلاسيك فاخرة - بيج ملكي','classic-luxury-beige','عباية أنيقة بقماش كريب فاخر وتفاصيل هادئة مناسبة للإطلالات اليومية الراقية.',45,65,'00000000-0000-4000-8000-000000000002','جديد',array['S','M','L','XL'],array['بيج'],array['/products/abaya-classic-beige.svg'],18,true,true),
('10000000-0000-4000-8000-000000000002','عباية سوداء مطرزة - لمسة روز قولد','rose-gold-black-abaya','تصميم عصري بلمسات روز قولد يناسب المناسبات والزيارات الرسمية.',52,null,'00000000-0000-4000-8000-000000000003','جديد',array['M','L','XL','XXL'],array['أسود','روز قولد'],array['/products/abaya-rose-black.svg'],11,true,true),
('10000000-0000-4000-8000-000000000003','عباية كريب يومية - راحة وأناقة','daily-crepe-abaya','خفيفة وعملية للاستخدام اليومي مع قصة مريحة وحركة سهلة.',38,null,'00000000-0000-4000-8000-000000000002',null,array['S','M','L'],array['موكا','أسود'],array['/products/abaya-daily-crepe.svg'],24,true,true),
('10000000-0000-4000-8000-000000000004','عباية شيفون طبقات - فخامة','layered-chiffon-abaya','طبقات شيفون ناعمة مع بطانة مريحة وتفاصيل أنثوية فاخرة.',58,75,'00000000-0000-4000-8000-000000000003','مميز',array['M','L','XL'],array['أسود','بني'],array['/products/abaya-chiffon.svg'],8,true,true),
('10000000-0000-4000-8000-000000000005','عباية مفتوحة كاجوال - ستايل عصري','casual-open-abaya','عباية مفتوحة سهلة التنسيق فوق فستان أو طقم يومي، بقصة نظيفة وعصرية.',42,null,'00000000-0000-4000-8000-000000000004','جديد',array['S','M','L','XL'],array['بيج','موكا'],array['/products/abaya-casual-open.svg'],20,true,true),
('10000000-0000-4000-8000-000000000006','عباية مطرزة يدوياً - قطعة فنية','hand-embroidered-abaya','تطريز يدوي دقيق وتشطيب فاخر لقطعة مميزة تُلبس في المناسبات الخاصة.',68,null,'00000000-0000-4000-8000-000000000005','حصري',array['M','L'],array['أسود','روز'],array['/products/abaya-hand-embroidered.svg'],6,true,true)
on conflict (id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,price=excluded.price,compare_at_price=excluded.compare_at_price,category_id=excluded.category_id,badge=excluded.badge,sizes=excluded.sizes,colors=excluded.colors,images=excluded.images,stock=excluded.stock,featured=excluded.featured,active=excluded.active;

insert into public.testimonials (id,customer_name,text,rating,active,sort_order) values
('20000000-0000-4000-8000-000000000001','سارة - عمّان','القماش مرتب جداً والتفصيل أجمل من الصور، ووصل الطلب بسرعة.',5,true,1),
('20000000-0000-4000-8000-000000000002','رنا - إربد','المقاس كان مضبوط وخدمة الواتساب ساعدتني أختار بسرعة.',5,true,2),
('20000000-0000-4000-8000-000000000003','لين - الزرقاء','التغليف فخم والعباية فعلاً قطعة مناسبة للهدية.',5,true,3)
on conflict (id) do update set customer_name=excluded.customer_name,text=excluded.text,rating=excluded.rating,active=excluded.active,sort_order=excluded.sort_order;

insert into public.faqs (id,question,answer,active,sort_order) values
('30000000-0000-4000-8000-000000000001','كيف أختار المقاس المناسب؟','من صفحة كل منتج ستجدين المقاسات المتوفرة. وإذا احتجتِ مساعدة، تواصلي معنا على واتساب وسنساعدك بالاختيار.',true,1),
('30000000-0000-4000-8000-000000000002','كم مدة التوصيل؟','عادةً يتم التوصيل داخل الأردن خلال 24-48 ساعة حسب المحافظة وتوفر المنتج.',true,2),
('30000000-0000-4000-8000-000000000003','هل يوجد استبدال؟','نعم، يمكن طلب الاستبدال وفق سياسة المتجر وحالة المنتج. يتم توضيح التفاصيل للعميلة قبل تأكيد الطلب.',true,3),
('30000000-0000-4000-8000-000000000004','هل أقدر أطلب تنسيق أو تعديل خاص؟','لبعض الموديلات يمكننا المساعدة في التنسيق أو التعديل البسيط. تواصلي معنا قبل الطلب للتأكد من الإمكانية.',true,4)
on conflict (id) do update set question=excluded.question,answer=excluded.answer,active=excluded.active,sort_order=excluded.sort_order;

insert into public.page_content (key,content) values ('about', $$
{
  "eyebrow":"OUR STORY",
  "title":"نوفا مودا… أناقة محتشمة بروح عصرية.",
  "intro":"بدأت حكايتنا من شغف حقيقي بالعباية كرمز للأناقة المحتشمة. نؤمن أن العباية ليست مجرد لباس؛ هي تعبير عن شخصية المرأة، ولهذا نهتم بالقماش، القصة، التشطيب والتفاصيل الصغيرة بنفس القدر.",
  "process_title":"من الفكرة للقطعة النهائية",
  "process_intro":"كل عباية تمر بمراحل واضحة من اختيار الفكرة والخامة حتى الفحص والتغليف.",
  "why_title":"تفاصيل محسوبة عشان تلبسي القطعة وأنتِ مرتاحة فيها.",
  "why_intro":"نركز على الجودة والراحة والخدمة، بدون تعقيد تجربة الشراء.",
  "why_points":["جودة قماش نختارها بعناية","تصاميم حصرية ومتجددة","خياطة متقنة وتشطيب نظيف","مقاسات متعددة وواضحة","توصيل سريع لجميع المحافظات","مساعدة مباشرة عبر واتساب"]
}
$$::jsonb)
on conflict (key) do update set content=excluded.content;

-- Featured brands / editable from Admin > Brands.
insert into public.brands (name, slug, tagline, description, sort_order, active, featured)
values
('Nova Signature','nova-signature','الخط الأساسي لنوفا مودا','قصّات ناعمة وتفاصيل هادئة صممت لتكون جزءاً من إطلالتك اليومية.',1,true,true),
('Noir Atelier','noir-atelier','عبايات سوداء بطابع فاخر','مجموعة سوداء للمناسبات والإطلالات الرسمية بتشطيبات راقية.',2,true,true),
('NOVA Daily','nova-daily','راحة يومية بمظهر مرتب','قطع عملية بخامات مريحة وقصّات سهلة للتنسيق اليومي.',3,true,true),
('Limited Edit','limited-edit','إصدارات محدودة وتفاصيل خاصة','قطع بعدد محدود للعميلة التي تبحث عن تصميم أقل تكراراً وأكثر حضوراً.',4,true,true)
on conflict (slug) do update set tagline=excluded.tagline, description=excluded.description, sort_order=excluded.sort_order, active=excluded.active, featured=excluded.featured;

update public.products set brand_id=(select id from public.brands where slug='nova-signature') where slug in ('classic-luxury-beige','casual-open-abaya');
update public.products set brand_id=(select id from public.brands where slug='noir-atelier') where slug in ('rose-gold-black-abaya','layered-chiffon-abaya');
update public.products set brand_id=(select id from public.brands where slug='nova-daily') where slug='daily-crepe-abaya';
update public.products set brand_id=(select id from public.brands where slug='limited-edit') where slug='hand-embroidered-abaya';

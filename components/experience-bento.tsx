"use client";

export function ExperienceBento() {
  return (
    <div className="py-16 md:py-20 bg-[#fafaf8] border-t border-black/[0.06]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="group bg-white border border-black/[0.06] rounded-[20px] p-6 md:p-7 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-black/[0.08] transition-all duration-300">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-5 text-[18px]">↗</div>
            <h3 className="font-bold text-[15px] mb-2">شحن مجاني</h3>
            <p className="text-[13px] text-black/50 leading-relaxed">توصيل مجاني لجميع الطلبات داخل الأردن خلال 24-48 ساعة</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-black/[0.06] rounded-[20px] p-6 md:p-7 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-black/[0.08] transition-all duration-300">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-5 text-[16px]">✓</div>
            <h3 className="font-bold text-[15px] mb-2">دفع آمن 100%</h3>
            <p className="text-[13px] text-black/50 leading-relaxed">وسائل دفع متعددة ومحمية - كاش عند الاستلام أو دفع إلكتروني</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-black/[0.06] rounded-[20px] p-6 md:p-7 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-black/[0.08] transition-all duration-300">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-5 text-[16px]">↺</div>
            <h3 className="font-bold text-[15px] mb-2">استرجاع سهل</h3>
            <p className="text-[13px] text-black/50 leading-relaxed">استرجاع مجاني خلال 14 يوم - رضاكم يهمنا وضمان جودة المنتج</p>
          </div>
        </div>

        {/* Bottom trust */}
        <div className="mt-12 text-center">
          <p className="text-[11px] tracking-[0.2em] text-black/30">NOVA MODA • DESIGNED WITH CARE IN AMMAN</p>
        </div>
      </div>
    </div>
  );
}
export default ExperienceBento;

"use client";

export function Hero() {
  return (
    <div className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative container mx-auto px-6 py-20 md:py-28 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small label */}
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] tracking-[0.25em] text-white/60 mb-8">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            NEW COLLECTION 2025
          </div>

          <h1 className="text-[40px] md:text-[64px] lg:text-[72px] font-[700] leading-[0.95] tracking-[-0.03em] mb-6">
            عبايات
            <span className="block font-[300] tracking-[0.05em] text-white/80 mt-1">نوفا مودا</span>
          </h1>

          <p className="text-[15px] md:text-[16px] text-white/50 tracking-[0.15em] mb-10 font-light">
            فخامة - عصرية - راحة
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#products" className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 rounded-full text-[13px] font-bold tracking-wide hover:bg-white/90 transition">
              تسوقي الآن
            </a>
            <a href="#products" className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-3.5 rounded-full text-[13px] tracking-wide hover:bg-white/10 transition">
              استكشفي المجموعة
            </a>
          </div>

          {/* Bottom stats */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-[22px] font-bold">+500</div>
              <div className="text-[11px] text-white/40 tracking-wide mt-1">عميلة راضية</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-[22px] font-bold">2025</div>
              <div className="text-[11px] text-white/40 tracking-wide mt-1">تشكيلة جديدة</div>
            </div>
            <div className="text-center">
              <div className="text-[22px] font-bold">100%</div>
              <div className="text-[11px] text-white/40 tracking-wide mt-1">جودة عالية</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Hero;

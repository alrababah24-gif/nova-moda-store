"use client";

export function BrandRail() {
  return (
    <div className="relative border-y border-black/[0.06] bg-white py-3.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-8 pr-8">
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">عبايات فاخرة مصممة بعناية</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">عبايات عصرية 2025</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">فخامة - أناقة - راحة</span>
          <span className="text-[10px] text-black/20">•</span>
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8 pr-8" aria-hidden>
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">عبايات فاخرة مصممة بعناية</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">عبايات عصرية 2025</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.3em] font-medium text-black/60">NOVA MODA</span>
          <span className="text-[10px] text-black/20">•</span>
          <span className="text-[12px] tracking-[0.15em] text-black/40">فخامة - أناقة - راحة</span>
          <span className="text-[10px] text-black/20">•</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
export default BrandRail;

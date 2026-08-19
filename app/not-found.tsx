import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#FFFBF7] px-5 text-center"><div><Image src="/brand/nova-moda-mark-clean.png" alt="نوفا مودا" width={160} height={160} className="mx-auto h-28 w-28 object-contain"/><p className="mt-5 text-xs font-extrabold tracking-[.2em] text-[#A27E6C]">404</p><h1 className="mt-2 text-3xl font-extrabold">الصفحة مش موجودة</h1><p className="mt-3 text-sm text-[#8C7A72]">يمكن الرابط تغيّر أو الصفحة انحذفت.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#3D2B24] px-6 py-3 text-sm font-extrabold text-white">العودة للرئيسية</Link></div></main>;
}

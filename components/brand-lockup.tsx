import Image from "next/image";
import Link from "next/link";
import type { StoreSettings } from "@/lib/types";

export function BrandLockup({settings,compact=false}:{settings:StoreSettings;compact?:boolean}){
  const mark=settings.logo_url||"/brand/nova-moda-mark-clean.png";
  return <Link href="/" className={`brand-lockup ${compact?"brand-lockup-compact":""}`} aria-label={settings.store_name}>
    <span className="brand-emblem" aria-hidden="true">
      <span className="brand-emblem-halo" />
      <span className="brand-emblem-ring" />
      <Image src={mark} alt="" width={96} height={96} priority={!compact} className="brand-mark-image"/>
    </span>
    <span className="brand-wording">
      <strong>NOVA MODA</strong>
      <small>نوفا مودا</small>
    </span>
  </Link>
}

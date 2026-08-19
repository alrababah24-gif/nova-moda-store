import type { CSSProperties } from "react";
import { AccountProvider } from "@/components/account/account-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteAtmosphere } from "@/components/site-atmosphere";
import { TopUtilityBar } from "@/components/top-utility-bar";
import { WhatsappButton } from "@/components/whatsapp-button";
import { RealtimeStoreSync } from "@/components/realtime-store-sync";
import { getSettings } from "@/lib/data";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const style = { "--brand-custom": settings.primary_color, "--paper-custom": settings.background_color } as CSSProperties;
  return (
    <AccountProvider>
      <div style={style} className="store-root min-h-screen">
        <SiteAtmosphere />
        <div className="relative z-10">
          <RealtimeStoreSync />
          <TopUtilityBar settings={settings} />
          <SiteHeader settings={settings} />
          <main>{children}</main>
          <SiteFooter settings={settings} />
          <WhatsappButton number={settings.whatsapp} />
          <CartDrawer />
        </div>
      </div>
    </AccountProvider>
  );
}

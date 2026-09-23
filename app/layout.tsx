import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart-provider";
import MetaPixel from "@/components/meta-pixel";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "نوفا مودا | عبايات نسائية فاخرة",
    template: "%s | نوفا مودا",
  },

  description:
    "نوفا مودا للعبايات النسائية الفاخرة في الأردن. براندات ومجموعات عصرية، أقمشة مختارة، ومقاسات متعددة مع توصيل لجميع المحافظات.",

  keywords: [
    "عبايات",
    "عبايات الأردن",
    "عبايات نسائية",
    "عبايات فاخرة",
    "نوفا مودا",
    "Nova Moda",
  ],

  openGraph: {
    type: "website",
    locale: "ar_JO",
    siteName: "نوفا مودا",
    title: "نوفا مودا | عبايات نسائية فاخرة",
    description:
      "عبايات بتفاصيل تليق فيك، مع توصيل لجميع محافظات الأردن.",
    images: [
      {
        url: "/brand/nova-moda-logo-clean.png",
        width: 550,
        height: 636,
        alt: "شعار نوفا مودا",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "نوفا مودا",
    description: "عبايات نسائية فاخرة في الأردن",
  },

  icons: {
    icon: "/brand/nova-moda-mark-clean.png",
    apple: "/brand/nova-moda-mark-clean.png",
  },
};

const themeScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem("nova-theme");

    const isDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    document.documentElement.style.colorScheme = isDark
      ? "dark"
      : "light";
  } catch (error) {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

const metaPixelScript = `
!function(f,b,e,v,n,t,s)
{
  if(f.fbq)return;

  n=f.fbq=function(){
    n.callMethod
      ? n.callMethod.apply(n,arguments)
      : n.queue.push(arguments)
  };

  if(!f._fbq)f._fbq=n;

  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];

  t=b.createElement(e);
  t.async=!0;
  t.src=v;

  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s);
}
(
  window,
  document,
  'script',
  'https://connect.facebook.net/en_US/fbevents.js'
);



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
    >
      <head>
        {/* Theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

  
      </head>

      <body
        className={`${tajawal.className} min-h-screen`}>
          <MetaPixel />
     
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

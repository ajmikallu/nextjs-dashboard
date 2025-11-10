import "@/app/ui/global.css";
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import NavLinks from '@/app/ui/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';



export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">

          {/* <div className="flex px-3 py-4 md:px-2 gap-4 bg-blue-500">
            <AcmeLogo />

            <NavLinks />
          </div> */}
          {children}
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  );
}

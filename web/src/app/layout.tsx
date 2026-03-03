import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Suspense } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'High Tech Sport | Montres connectées, Vélos & Accessoires – Khemis Miliana',
  description:
    'Votre boutique d\'équipements sportifs à Khemis Miliana, Algérie. Montres connectées Garmin, Samsung, Apple Watch. Vélos électriques et de route. Accessoires cyclisme. Livraison vers les 58 wilayas. Paiement à la livraison.',
  keywords: 'montres connectées, vélos électriques, accessoires vélo, Garmin, Samsung, Khemis Miliana, Algérie, paiement à la livraison',
  openGraph: {
    title: 'High Tech Sport | Équipements sportifs premium',
    description: 'Montres connectées, vélos et accessoires. Livraison vers les 58 wilayas. Paiement à la livraison.',
    type: 'website',
    locale: 'fr_DZ',
    siteName: 'High Tech Sport',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00D4AA" />
        {/* Google Analytics 4 Placeholder */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Facebook Pixel Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1111111111111111');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]" suppressHydrationWarning>
        <ThemeProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
              },
              duration: 3000,
            }}
          />
          <Suspense fallback={<div className="h-[60px]" />}>
            <Header />
          </Suspense>
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
          <CartPanel />
          <WhatsAppButton />

        </ThemeProvider>
      </body>
    </html>
  );
}

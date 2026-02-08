import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Force all pages to be server-rendered on demand (no static prerendering)
// This avoids Windows path casing issues that cause dual React instances during SSG
export const dynamic = 'force-dynamic';

// Use CSS variables with system fonts as fallback to avoid Google Fonts network issues
// The CSS will define --font-inter and --font-orbitron using @font-face or system fallbacks

export const metadata: Metadata = {
  title: 'Ilorin Automotive Festival 2026 | Buy Tickets Now',
  description:
    'Experience the biggest automotive event in Ilorin. Cars, Bikes, Drift, Lifestyle. May 30, 2026 at Metropolitan Square.',
  keywords: [
    'Ilorin Automotive Festival',
    'IAF 2026',
    'Car Show',
    'Drift Championship',
    'Tickets',
    'Ilorin Events',
  ],
  openGraph: {
    title: 'Ilorin Automotive Festival 2026',
    description: 'The biggest automotive experience in Ilorin',
    url: 'https://ilorinautofest.com',
    siteName: 'IAF 2026',
    images: [
      {
        url: 'https://ilorinautofest.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ilorin Automotive Festival 2026',
    description: 'The biggest automotive experience in Ilorin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Fonts loaded via link tag - more reliable than next/font/google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-brand-orange selection:text-white">
        <Navbar />
        {/* Main content wrapper */}
        <main>{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}

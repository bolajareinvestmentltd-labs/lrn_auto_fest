import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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

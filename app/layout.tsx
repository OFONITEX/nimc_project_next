import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Providers } from '@/app/providers';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'OFONITECH SOLUTIONZ — Identity Verification & Technology Solutions | myninverify.com',
    template: '%s | OFONITECH SOLUTIONZ',
  },
  description: 'Enterprise NIN Verification, BVN Services, Identity APIs, and Custom Technology Solutions in Nigeria (myninverify.com).',
  icons: {
    icon: '/img/ofonitech_logo.jpg',
    shortcut: '/img/ofonitech_logo.jpg',
    apple: '/img/ofonitech_logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

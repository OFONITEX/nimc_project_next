import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'OFONITECH SOLUTIONZ — Identity Verification & Technology Solutions | myninverify.com',
  description: 'Enterprise NIN Verification, BVN Services, Identity APIs, and Custom Technology Solutions in Nigeria (myninverify.com).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/jpeg" href="/img/ofonitech_logo.jpg"/>
        <link rel="shortcut icon" href="/img/ofonitech_logo.jpg"/>
        <link rel="apple-touch-icon" href="/img/ofonitech_logo.jpg"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

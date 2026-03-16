import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { Metadata } from 'next';
import LocationPermissionPrompt from '@/components/common/LocationPermissionPrompt';
import { ToastContainer } from 'react-toastify';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wavepay",
  description: "Providing Payout Services",
  icons: {
    icon: "/images/logo/wavepay-logo.png",
    shortcut: "/images/logo/wavepay-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This script runs before the page renders to prevent the white flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <LocationPermissionPrompt />
        <ThemeProvider>
          <ProfileProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ProfileProvider>
        </ThemeProvider>
        <ToastContainer
           position="top-center"
           autoClose={3000}
           hideProgressBar={false}
           newestOnTop
           closeOnClick
           pauseOnHover
           theme="colored" // Changed to colored or dark for better consistency
           toastStyle={{ zIndex: 10000000 }}
         />
      </body>
    </html>
  );
}
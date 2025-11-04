import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Marwan's Photo Printing`,
  description: 'A demo photo printing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Toaster
          position='top-center'
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
              style: {
                border: '1px solid #10B981',
                background: '#f0fdf4',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
              style: {
                border: '1px solid #EF4444',
                background: '#fef2f2',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sales Dashboard',
  description: 'Real-Time Sales Analytics Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white shadow p-4">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">📊 Sales Dashboard</h1>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

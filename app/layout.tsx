import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from './context/ExpenseContext';
import Navigation from './components/Navigation';
import UserSelection from './components/UserSelection';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travel Expense Tracker',
  description: 'Manage your trip expenses with friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 selection:bg-cyan-500/30`}>
        <ExpenseProvider>
          <UserSelection />
          <div className="mx-auto max-w-md min-h-screen flex flex-col relative shadow-2xl bg-black/20">
            {/* Main Content Area - padded bottom for nav */}
            <main className="flex-1 p-6 pb-24 overflow-y-auto">
              {children}
            </main>

            {/* Bottom Navigation */}
            <Navigation />
          </div>
        </ExpenseProvider>
      </body>
    </html>
  );
}

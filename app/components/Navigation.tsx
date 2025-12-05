'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Since we don't know if heroicons is installed, I'll use inline SVGs for safety and speed.

const NavItem = ({ href, label, active, icon }: { href: string; label: string; active: boolean; icon: React.ReactNode }) => {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${active ? 'text-cyan-400 scale-110' : 'text-slate-400 hover:text-slate-200'
                }`}
        >
            <div className="w-6 h-6 mb-1">{icon}</div>
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
            {active && <div className="absolute -top-3 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
        </Link>
    );
};

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md border-t border-white/10" />

            <div className="relative flex items-center justify-around h-20 px-2 pb-2">
                <NavItem
                    href="/"
                    label="Home"
                    active={pathname === '/'}
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    }
                />
                <NavItem
                    href="/transport"
                    label="Trip"
                    active={pathname === '/transport'}
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                    }
                />
                <NavItem
                    href="/alat"
                    label="Alat"
                    active={pathname === '/alat'}
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                    }
                />
                <NavItem
                    href="/makanan"
                    label="Makan"
                    active={pathname === '/makanan'}
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    }
                />
            </div>
        </nav>
    );
}

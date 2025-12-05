'use client';

import { useExpense } from '../context/ExpenseContext';
import { useState } from 'react';
import { User } from '../types';

export default function UserSelection() {
    const { users, currentUser, setCurrentUser } = useExpense();
    const [selectedName, setSelectedName] = useState(users[0]?.name || '');

    if (currentUser) return null;

    const handleLogin = () => {
        const user = users.find(u => u.name === selectedName);
        if (user) {
            setCurrentUser(user);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <div className="w-full max-w-sm bg-slate-800 rounded-3xl shadow-2xl border border-white/10 p-8 animate-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Selamat Datang!
                    </h1>
                    <p className="text-slate-400">Siapa kamu?</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <select
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                            className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            {users.map((user) => (
                                <option key={user.name} value={user.name}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                    >
                        Masuk
                    </button>
                </div>
            </div>
        </div>
    );
}

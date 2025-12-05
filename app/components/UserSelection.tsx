'use client';

import { useExpense } from '../context/ExpenseContext';
import { User } from '../types';

export default function UserSelection() {
    const { users, currentUser, setCurrentUser } = useExpense();

    if (currentUser) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <div className="w-full max-w-sm bg-slate-800 rounded-3xl shadow-2xl border border-white/10 p-8 animate-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Selamat Datang!
                    </h1>
                    <p className="text-slate-400">Siapa kamu?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {users.map((user) => (
                        <button
                            key={user.name}
                            onClick={() => setCurrentUser(user)}
                            className="p-4 rounded-2xl bg-slate-700/50 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 transition-all group"
                        >
                            <span className="font-semibold text-slate-200 group-hover:text-cyan-400">{user.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

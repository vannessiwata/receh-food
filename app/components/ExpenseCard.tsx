'use client';

import { Expense, User } from '../types';

interface ExpenseCardProps {
    expense: Expense;
    onDelete: (id: string) => void;
}

export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
    return (
        <div className="group relative p-4 mb-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-100">{expense.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                        Paid by <span className="text-cyan-400 font-medium">{expense.payer}</span> • {new Date(expense.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-emerald-400">
                        Rp {expense.amount.toLocaleString()}
                    </span>
                    <button
                        onClick={() => onDelete(expense.id)}
                        className="mt-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Expense"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

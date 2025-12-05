'use client';

import { useState } from 'react';
import { Expense, User } from '../types';
import ConfirmModal from './ConfirmModal';

interface ExpenseCardProps {
    expense: Expense;
    onDelete: (id: string) => void;
    onEdit?: (expense: Expense) => void;
}

export default function ExpenseCard({ expense, onDelete, onEdit }: ExpenseCardProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <>
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
                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="p-1 text-slate-500 hover:text-cyan-400"
                                    title="Edit Expense"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="p-1 text-slate-500 hover:text-red-400"
                                title="Delete Expense"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => onDelete(expense.id)}
                title="Delete Expense?"
                message={`Are you sure you want to delete "${expense.title}"? This action cannot be undone.`}
            />
        </>
    );
}

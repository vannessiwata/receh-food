import { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';

interface SettleUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Debt {
    from: string;
    to: string;
    amount: number;
}

export default function SettleUpModal({ isOpen, onClose }: SettleUpModalProps) {
    const { expenses, users } = useExpense();

    const settlement = useMemo(() => {
        // 1. Calculate Total Expense
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        // 2. Calculate Share Per Person
        const sharePerPerson = totalExpense / users.length;

        // 3. Calculate Paid Per Person
        const paidBy: Record<string, number> = {};
        users.forEach(u => paidBy[u.name] = 0);

        expenses.forEach(e => {
            if (paidBy[e.payer] !== undefined) {
                paidBy[e.payer] += e.amount;
            } else {
                paidBy[e.payer] = e.amount;
            }
        });

        // 4. Calculate Gross Receivables (Per Payer)
        // For each person who paid amount P, every OTHER user owes P / N to them.
        // This is what the user requested: "5.000.000 / 7 ke dojeng"
        const receivables: { payer: string; amountPerUser: number; totalPaid: number }[] = [];

        Object.entries(paidBy).forEach(([payer, amount]) => {
            if (amount > 0) {
                receivables.push({
                    payer,
                    totalPaid: amount,
                    amountPerUser: amount / users.length
                });
            }
        });

        return {
            totalExpense,
            sharePerPerson,
            paidBy,
            receivables
        };
    }, [expenses, users]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Settlement</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">Total Expenses</div>
                        <div className="text-2xl font-bold text-white">Rp {settlement.totalExpense.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">Share Per Person</div>
                        <div className="text-2xl font-bold text-cyan-400">Rp {Math.round(settlement.sharePerPerson).toLocaleString()}</div>
                    </div>
                </div>

                {/* Paid By Breakdown */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Total Paid By User</h3>
                    <div className="space-y-2">
                        {Object.entries(settlement.paidBy)
                            .sort(([, a], [, b]) => b - a)
                            .map(([name, amount]) => (
                                <div key={name} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="font-medium text-slate-200">{name}</span>
                                    <span className="font-mono text-slate-300">Rp {amount.toLocaleString()}</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Settlement Plan (Gross) */}
                <div>
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">Payment Instructions</h3>
                    {settlement.receivables.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {settlement.receivables.map((rec, index) => (
                                <div key={index} className="p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 border-l-4 border-emerald-500 rounded-r-xl">
                                    <div className="mb-2">
                                        <span className="text-slate-400 text-sm">Everyone pays </span>
                                        <span className="font-bold text-white">{rec.payer}</span>
                                    </div>
                                    <div className="font-bold text-2xl text-emerald-400 mb-1">
                                        Rp {Math.round(rec.amountPerUser).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        (Total paid: Rp {rec.totalPaid.toLocaleString()} / {users.length} people)
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-500">
                        Calculated based on {users.length} users sharing {expenses.length} expenses equally.
                    </p>
                </div>
            </div>
        </div>
    );
}

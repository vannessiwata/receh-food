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
    const { expenses, users, addSettlement } = useExpense();
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedPayer, setExpandedPayer] = useState<string | null>(null);

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

    const handleSettle = async () => {
        if (!note.trim()) {
            alert('Please add a note for this settlement (e.g. "Trip to Bali")');
            return;
        }
        if (confirm('This will clear all current expenses and save them to history. Are you sure?')) {
            setIsSubmitting(true);
            try {
                await addSettlement(note);
                setNote('');
                onClose();
            } catch (error) {
                console.error("Error settling up:", error);
                alert("Failed to settle up. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

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
                            .map(([name, amount]) => {
                                const isExpanded = expandedPayer === name;
                                const userExpenses = expenses.filter(e => e.payer === name);

                                return (
                                    <div key={name} className="bg-white/5 rounded-lg overflow-hidden transition-all duration-200">
                                        <button
                                            onClick={() => setExpandedPayer(isExpanded ? null : name)}
                                            className="w-full flex justify-between items-center p-3 hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span className="font-medium text-slate-200">{name}</span>
                                            </div>
                                            <span className="font-mono text-slate-300">Rp {amount.toLocaleString()}</span>
                                        </button>

                                        {isExpanded && (
                                            <div className="bg-black/20 border-t border-white/5 p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                {userExpenses.length === 0 ? (
                                                    <p className="text-xs text-slate-500 text-center">No expenses recorded.</p>
                                                ) : (
                                                    userExpenses.map(expense => (
                                                        <div key={expense.id} className="flex justify-between items-start text-xs">
                                                            <div className="text-slate-400">
                                                                <span className="text-slate-300">{expense.title}</span>
                                                                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-500 uppercase">{expense.category}</span>
                                                            </div>
                                                            <div className="font-mono text-slate-500">
                                                                Rp {expense.amount.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Settlement Plan (Gross) */}
                <div className="mb-8">
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

                {/* Action Section */}
                <div className="pt-6 border-t border-white/10">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Save to History</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note (e.g. Trip to Bali 2024)..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 mb-4 h-24 resize-none"
                    />
                    <button
                        onClick={handleSettle}
                        disabled={isSubmitting || expenses.length === 0}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : 'Finish & Clear Expenses'}
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-3">
                        This will reset all expenses to 0 and save the current state to history.
                    </p>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Settlement } from '../types';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
    const { settlements } = useExpense();
    const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {selectedSettlement ? 'Settlement Details' : 'Settlement History'}
                    </h2>
                    <button
                        onClick={() => {
                            if (selectedSettlement) setSelectedSettlement(null);
                            else onClose();
                        }}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                        {selectedSettlement ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>

                {selectedSettlement ? (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <div className="text-sm text-slate-400">Note</div>
                            <div className="text-lg font-bold text-white">{selectedSettlement.note}</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {new Date(selectedSettlement.date).toLocaleDateString()} • {new Date(selectedSettlement.date).toLocaleTimeString()}
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                                <span className="text-sm text-slate-400">Total Amount</span>
                                <span className="text-xl font-bold text-emerald-400">Rp {selectedSettlement.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-300">Expenses Snapshot</h3>
                            {selectedSettlement.expenses.map(e => (
                                <div key={e.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg text-sm">
                                    <div>
                                        <div className="text-slate-200 font-medium">{e.title}</div>
                                        <div className="text-xs text-slate-500">{e.payer} • {e.category}</div>
                                    </div>
                                    <div className="text-cyan-400 font-mono">
                                        Rp {e.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {settlements.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">No history found.</div>
                        ) : (
                            settlements.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSettlement(s)}
                                    className="w-full text-left p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{s.note}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {new Date(s.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-emerald-400 font-bold">
                                            Rp {s.totalAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

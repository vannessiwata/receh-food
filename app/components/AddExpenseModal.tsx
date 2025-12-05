'use client';

import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Category } from '../types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory: Category;
}

export default function AddExpenseModal({ isOpen, onClose, defaultCategory }: AddExpenseModalProps) {
    const { addExpense, users, addUser, currentUser } = useExpense();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState(currentUser?.name || users[0].name);
    const [newUserName, setNewUserName] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !payer) return;

        addExpense({
            title,
            amount: parseFloat(amount),
            payer,
            category: defaultCategory,
            date: new Date().toISOString(),
        });

        // Reset and close
        setTitle('');
        setAmount('');
        onClose();
    };

    const handleAddUser = () => {
        if (newUserName.trim()) {
            addUser(newUserName.trim());
            setPayer(newUserName.trim());
            setNewUserName('');
            setIsAddingUser(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 text-white">Add Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="e.g. Grab to Hotel"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Amount (Rp)</label>
                        <input
                            type="text"
                            value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (value === '' || /^\d+$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="0"
                            required
                        />
                    </div>



                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Paid By</label>
                        {!isAddingUser ? (
                            <div className="flex gap-2">
                                <select
                                    value={payer}
                                    onChange={(e) => setPayer(e.target.value)}
                                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                >
                                    {users.map((u) => (
                                        <option key={u.name} value={u.name}>{u.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(true)}
                                    className="px-3 py-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="Name"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddUser}
                                    className="px-3 py-2 bg-emerald-600 rounded-lg text-white"
                                >
                                    ✓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(false)}
                                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

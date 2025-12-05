'use client';

import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Category, Expense } from '../types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory: Category;
    expenseToEdit?: Expense;
}

export default function AddExpenseModal({ isOpen, onClose, defaultCategory, expenseToEdit }: AddExpenseModalProps) {
    const { addExpense, updateExpense, users, addUser, currentUser } = useExpense();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState(currentUser?.name || users[0].name);
    const [newUserName, setNewUserName] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (expenseToEdit) {
                setTitle(expenseToEdit.title);
                setAmount(expenseToEdit.amount.toString());
                setPayer(expenseToEdit.payer);
            } else {
                setTitle('');
                setAmount('');
                setPayer(currentUser?.name || users[0].name);
            }
        }
    }, [isOpen, expenseToEdit, currentUser, users]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !payer) return;

        if (expenseToEdit) {
            updateExpense(expenseToEdit.id, {
                title,
                amount: parseFloat(amount),
                payer,
                category: defaultCategory, // Usually category doesn't change here but we keep it consistent
            });
        } else {
            addExpense({
                title,
                amount: parseFloat(amount),
                payer,
                category: defaultCategory,
                date: new Date().toISOString(),
            });
        }

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
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 text-slate-800">{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium placeholder:text-slate-400"
                            placeholder="e.g. Grab to Hotel"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Amount (Rp)</label>
                        <input
                            type="text"
                            value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (value === '' || /^\d+$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium placeholder:text-slate-400"
                            placeholder="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Paid By</label>
                        {!isAddingUser ? (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={payer}
                                        onChange={(e) => setPayer(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    >
                                        {users.map((u) => (
                                            <option key={u.name} value={u.name}>{u.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(true)}
                                    className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors font-bold text-lg"
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
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="Name"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddUser}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                    ✓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(false)}
                                    className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-8 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all"
                        >
                            {expenseToEdit ? 'Update Expense' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

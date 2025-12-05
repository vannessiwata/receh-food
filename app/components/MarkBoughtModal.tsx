'use client';

import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { InventoryItem } from '../types';

interface MarkBoughtModalProps {
    item: InventoryItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function MarkBoughtModal({ item, isOpen, onClose }: MarkBoughtModalProps) {
    const { updateInventoryItem, users, addUser, currentUser } = useExpense();
    const [price, setPrice] = useState(item.price?.toString() || '');
    const [payer, setPayer] = useState(item.purchaser || currentUser?.name || users[0].name);
    const [newUserName, setNewUserName] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateInventoryItem(item.id, {
            isBought: true,
            price: price ? parseFloat(price) : undefined,
            purchaser: payer
        });

        onClose();
    };

    const handleCreateUser = () => {
        if (newUserName.trim()) {
            addUser(newUserName.trim());
            setPayer(newUserName.trim());
            setNewUserName('');
            setIsAddingUser(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-1 text-white">Mark as Bought</h2>
                <p className="text-slate-400 text-sm mb-6">Barang: <span className="text-cyan-400">{item.name}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Price (Rp)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="0"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Who Bought It?</label>
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
                                    onClick={handleCreateUser}
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
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

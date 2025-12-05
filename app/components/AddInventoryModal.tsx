'use client';

import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddInventoryModal({ isOpen, onClose }: AddInventoryModalProps) {
    const { addInventoryItem } = useExpense();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        addInventoryItem({
            name,
            quantityNeeded: quantity,
            // price is optional, initially 0 or undefined
        });

        setName('');
        setQuantity('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 text-white">Add Item to Buy</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="e.g. Beras"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Quantity (Optional)</label>
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="e.g. 5kg"
                        />
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
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

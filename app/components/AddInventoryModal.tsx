'use client';

import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { InventoryItem } from '../types';

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: InventoryItem;
}

export default function AddInventoryModal({ isOpen, onClose, itemToEdit }: AddInventoryModalProps) {
    const { addInventoryItem, updateInventoryItem, addExpense, users, currentUser, addUser } = useExpense();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    // New fields
    const [isBought, setIsBought] = useState(false);
    const [price, setPrice] = useState('');
    const [payer, setPayer] = useState(currentUser?.name || users[0]?.name);
    const [newUserName, setNewUserName] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setName(itemToEdit.name);
                setQuantity(itemToEdit.quantityNeeded);
                setIsBought(itemToEdit.isBought);
                setPrice(itemToEdit.price ? itemToEdit.price.toString() : '');
                setPayer(itemToEdit.purchaser || currentUser?.name || users[0]?.name);
            } else {
                setName('');
                setQuantity('');
                setIsBought(false);
                setPrice('');
                setPayer(currentUser?.name || users[0]?.name);
            }
        }
    }, [isOpen, itemToEdit, currentUser, users]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const finalPrice = price ? parseFloat(price) : 0;

        if (itemToEdit) {
            const updates: any = {
                name,
                quantityNeeded: quantity,
                isBought,
            };
            if (isBought) {
                updates.price = finalPrice;
                updates.purchaser = payer;
            } else {
                updates.price = null;
                updates.purchaser = null;
            }

            updateInventoryItem(itemToEdit.id, updates);

            // If changing from not bought to bought, add expense
            if (isBought && !itemToEdit.isBought && finalPrice > 0) {
                addExpense({
                    title: name,
                    amount: finalPrice,
                    category: 'makanan',
                    payer: payer,
                    date: new Date().toISOString()
                });
            }
        } else {
            const inventoryItem: any = {
                name,
                quantityNeeded: quantity,
                isBought: isBought,
            };

            if (isBought) {
                inventoryItem.price = finalPrice;
                inventoryItem.purchaser = payer;
            }

            addInventoryItem(inventoryItem);

            // If already bought, add to expenses immediately
            if (isBought && finalPrice > 0) {
                addExpense({
                    title: name,
                    amount: finalPrice,
                    category: 'makanan',
                    payer: payer,
                    date: new Date().toISOString()
                });
            }
        }

        // Reset
        setName('');
        setQuantity('');
        setIsBought(false);
        setPrice('');
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
                <h2 className="text-xl font-bold mb-4 text-white">{itemToEdit ? 'Edit Item' : 'Add Item'}</h2>

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

                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isBought ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-slate-900/50'}`}>
                                {isBought && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <input
                                type="checkbox"
                                checked={isBought}
                                onChange={(e) => setIsBought(e.target.checked)}
                                className="hidden"
                            />
                            <span className={`text-sm ${isBought ? 'text-emerald-400 font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                Sudah dibeli?
                            </span>
                        </label>
                    </div>

                    {isBought && (
                        <div className="space-y-4 pl-4 border-l-2 border-emerald-500/20 animate-in slide-in-from-left-2 duration-200">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Price (Rp)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="0"
                                    required={isBought}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Who Paid?</label>
                                {!isAddingUser ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={payer}
                                            onChange={(e) => setPayer(e.target.value)}
                                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                        </div>
                    )}

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
                            {itemToEdit ? 'Update Item' : (isBought ? 'Save & Add Expense' : 'Add to List')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

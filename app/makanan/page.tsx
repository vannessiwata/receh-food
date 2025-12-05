'use client';

import { useState } from 'react';
import CategoryLayout from '../components/CategoryPage';
import { useExpense } from '../context/ExpenseContext';
import AddInventoryModal from '../components/AddInventoryModal';
import MarkBoughtModal from '../components/MarkBoughtModal';
import { InventoryItem } from '../types';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';

export default function MakananPage() {
    const [activeTab, setActiveTab] = useState<'expenses' | 'inventory'>('inventory');
    const { inventory, expenses, deleteExpense, updateInventoryItem, deleteInventoryItem } = useExpense();
    const [isInvModalOpen, setIsInvModalOpen] = useState(false);
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [selectedItemToBuy, setSelectedItemToBuy] = useState<InventoryItem | null>(null);

    // Filter expenses for 'makanan'
    const filteredExpenses = expenses.filter(e => e.category === 'makanan');
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const handleItemClick = (item: InventoryItem) => {
        if (item.isBought) {
            // Simple toggle back to unbought (undo)
            const undo = confirm(`Mark "${item.name}" as NOT bought?`);
            if (undo) updateInventoryItem(item.id, { isBought: false, price: undefined, purchaser: undefined });
        } else {
            setSelectedItemToBuy(item);
        }
    }

    return (
        <div className="min-h-full">
            {/* Consistent Header */}
            <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md -mx-6 px-6 py-4 border-b border-white/5 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Makanan & Minuman</h1>
                        <p className="text-xs text-slate-400">Bahan masak, snack, air galon.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400">
                            {activeTab === 'inventory' ? 'Total Items' : 'Total Pengeluaran'}
                        </div>
                        <div className={`text-lg font-bold ${activeTab === 'inventory' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                            {activeTab === 'inventory'
                                ? inventory.length
                                : `Rp ${totalExpenses.toLocaleString()}`
                            }
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-1 rounded-xl flex border border-white/10">
                    <button
                        onClick={() => setActiveTab('expenses')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'expenses'
                            ? 'bg-cyan-500/20 text-cyan-400 shadow-inner'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Pengeluaran
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inventory'
                            ? 'bg-emerald-500/20 text-emerald-400 shadow-inner'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Belanjaan
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-2 pb-24">
                {activeTab === 'expenses' ? (
                    // Expenses List
                    filteredExpenses.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-4xl mb-2">💸</p>
                            <p>Belum ada pengeluaran</p>
                        </div>
                    ) : (
                        filteredExpenses.map(expense => (
                            <ExpenseCard key={expense.id} expense={expense} onDelete={deleteExpense} />
                        ))
                    )
                ) : (
                    // Inventory List
                    inventory.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-4xl mb-2">📝</p>
                            <p>List belanja kosong</p>
                        </div>
                    ) : (
                        inventory.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${item.isBought
                                    ? 'bg-slate-800/30 border-slate-800 opacity-80'
                                    : 'bg-slate-800 border-white/10 hover:border-emerald-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-6 h-6 min-w-[1.5rem] rounded-full border-2 flex items-center justify-center transition-colors ${item.isBought ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                                        }`}>
                                        {item.isBought && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className={`font-medium ${item.isBought ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                                {item.name}
                                            </span>
                                            {item.isBought && item.price && (
                                                <span className="text-emerald-400 font-mono text-sm whitespace-nowrap ml-2">
                                                    Rp {item.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-1">
                                            {item.quantityNeeded && (
                                                <span className="text-xs text-slate-400">{item.quantityNeeded}</span>
                                            )}
                                            {item.isBought && item.purchaser && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-cyan-300 ml-auto">
                                                    Dibeli: {item.purchaser}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteInventoryItem(item.id);
                                    }}
                                    className="ml-3 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => activeTab === 'inventory' ? setIsInvModalOpen(true) : setIsExpModalOpen(true)}
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-white text-2xl hover:scale-105 active:scale-95 transition-all z-40 ${activeTab === 'inventory'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/50'
                    }`}
            >
                +
            </button>

            <AddInventoryModal
                isOpen={isInvModalOpen}
                onClose={() => setIsInvModalOpen(false)}
            />

            <AddExpenseModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
                defaultCategory="makanan"
            />

            {/* Modal for marking as bought */}
            {selectedItemToBuy && (
                <MarkBoughtModal
                    item={selectedItemToBuy}
                    isOpen={!!selectedItemToBuy}
                    onClose={() => setSelectedItemToBuy(null)}
                />
            )}
        </div>
    );
}

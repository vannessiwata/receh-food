'use client';

import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Category, Expense } from '../types';
import ExpenseCard from './ExpenseCard';
import AddExpenseModal from './AddExpenseModal';

interface CategoryLayoutProps {
    title: string;
    category: Category;
    description: string;
}

export default function CategoryLayout({ title, category, description }: CategoryLayoutProps) {
    const { expenses, deleteExpense, users } = useExpense();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayer, setSelectedPayer] = useState('All');

    const filteredExpenses = expenses
        .filter(e => e.category === category)
        .filter(e => {
            const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPayer = selectedPayer === 'All' || e.payer === selectedPayer;
            return matchesSearch && matchesPayer;
        });

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const handleEdit = (expense: Expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExpenseToEdit(undefined);
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md -mx-6 px-6 py-4 border-b border-white/5 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        <p className="text-xs text-slate-400">{description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400">Total</div>
                        <div className="text-lg font-bold text-cyan-400">Rp {total.toLocaleString()}</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <select
                        value={selectedPayer}
                        onChange={(e) => setSelectedPayer(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                        <option value="All">All Payers</option>
                        {users.map(u => (
                            <option key={u.name} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="space-y-1 pb-20">
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-4xl mb-2">💸</p>
                        <p>Belum ada pengeluaran</p>
                    </div>
                ) : (
                    filteredExpenses.map(expense => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            onDelete={deleteExpense}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>

            {/* FAB (Floating Action Button) */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center text-white text-2xl hover:scale-105 active:scale-95 transition-all z-40"
            >
                +
            </button>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                defaultCategory={category}
                expenseToEdit={expenseToEdit}
            />
        </div>
    );
}

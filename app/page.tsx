'use client';

import { useExpense } from './context/ExpenseContext';
import { useState } from 'react';

import SettleUpModal from './components/SettleUpModal';

export default function Home() {
  const { expenses, currentUser, logout } = useExpense();
  const [expandedPayer, setExpandedPayer] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'group' | 'personal'>('group');
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);

  // Filter expenses based on active type
  // 'group' shows all expenses
  // 'personal' shows only expenses paid by current user
  const filteredExpenses = activeType === 'group'
    ? expenses
    : expenses.filter(e => e.payer === currentUser?.name);

  const totalExpense = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals = {
    transport: filteredExpenses.filter(e => e.category === 'transport').reduce((sum, e) => sum + e.amount, 0),
    alat: filteredExpenses.filter(e => e.category === 'alat').reduce((sum, e) => sum + e.amount, 0),
    makanan: filteredExpenses.filter(e => e.category === 'makanan').reduce((sum, e) => sum + e.amount, 0),
  };

  // Group expenses by payer
  const expensesByPayer: Record<string, typeof expenses> = {};
  filteredExpenses.forEach(e => {
    if (!expensesByPayer[e.payer]) {
      expensesByPayer[e.payer] = [];
    }
    expensesByPayer[e.payer].push(e);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Trip Summary
            </h1>
            <p className="text-slate-400 text-sm">Hi, {currentUser?.name || 'User'}!</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettleUpModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 hover:bg-emerald-500/20 transition-colors text-emerald-400"
            >
              <span className="text-xs font-bold">Settle</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 flex items-center gap-2 hover:bg-slate-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-[10px] flex items-center justify-center font-bold text-white">
                {currentUser?.name?.charAt(0) || '?'}
              </div>
              <span className="text-xs font-medium text-slate-300">Ganti</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 p-1 rounded-xl flex border border-white/10">
          <button
            onClick={() => setActiveType('group')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'group'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-inner'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            Group
          </button>
          <button
            onClick={() => setActiveType('personal')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'personal'
              ? 'bg-purple-500/20 text-purple-400 shadow-inner'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            Personal
          </button>
        </div>
      </header>

      {/* Main Total Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-slate-300 text-sm mb-1 font-medium">Total Pengeluaran</h2>
        <div className="text-4xl font-bold text-white mb-4">
          Rp {totalExpense.toLocaleString()}
        </div>
        <div className="flex gap-2 text-xs">
          <span className="bg-white/10 px-2 py-1 rounded text-slate-300">{expenses.length} Transactions</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <section>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">By Category</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <div className="text-cyan-400 mb-2">Transport</div>
            <div className="text-xl font-bold">Rp {categoryTotals.transport.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <div className="text-emerald-400 mb-2">Makanan</div>
            <div className="text-xl font-bold">Rp {categoryTotals.makanan.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 col-span-2">
            <div className="flex justify-between items-center">
              <div className="text-orange-400">Alat & Perlengkapan</div>
              <div className="text-xl font-bold">Rp {categoryTotals.alat.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Payer Breakdown */}
      {/* Payer Breakdown */}
      <section className="pb-20">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Who Paid What</h3>
        <div className="space-y-4">
          {Object.entries(expensesByPayer).map(([name, userExpenses]) => {
            const userTotal = userExpenses.reduce((sum, e) => sum + e.amount, 0);
            const isExpanded = expandedPayer === name;

            return (
              <div key={name} className="bg-slate-800/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpandedPayer(isExpanded ? null : name)}
                  className="w-full p-4 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-400">Rp {userTotal.toLocaleString()}</span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 space-y-3 border-t border-white/5 bg-slate-900/20">
                    {userExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-start text-sm">
                        <div className="text-slate-300 flex-1 pr-4">
                          {expense.title}
                          <div className="text-[10px] text-slate-500 uppercase mt-0.5">{expense.category}</div>
                        </div>
                        <div className="font-mono text-slate-400 whitespace-nowrap">
                          Rp {expense.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {Object.keys(expensesByPayer).length === 0 && (
            <p className="text-center text-slate-500 py-4 text-sm">Belum ada data pengeluaran.</p>
          )}
        </div>
      </section>

      <SettleUpModal
        isOpen={isSettleUpModalOpen}
        onClose={() => setIsSettleUpModalOpen(false)}
      />
    </div>
  );
}

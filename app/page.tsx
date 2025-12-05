'use client';

import { useExpense } from './context/ExpenseContext';

export default function Home() {
  const { expenses, currentUser, logout } = useExpense();

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals = {
    transport: expenses.filter(e => e.category === 'transport').reduce((sum, e) => sum + e.amount, 0),
    alat: expenses.filter(e => e.category === 'alat').reduce((sum, e) => sum + e.amount, 0),
    makanan: expenses.filter(e => e.category === 'makanan').reduce((sum, e) => sum + e.amount, 0),
  };

  // Calculate per person
  const payerTotals: Record<string, number> = {};
  expenses.forEach(e => {
    payerTotals[e.payer] = (payerTotals[e.payer] || 0) + e.amount;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Trip Summary
          </h1>
          <p className="text-slate-400 text-sm">Hi, {currentUser?.name || 'User'}!</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 flex items-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-[10px] flex items-center justify-center font-bold text-white">
            {currentUser?.name?.charAt(0) || '?'}
          </div>
          <span className="text-xs font-medium text-slate-300">Ganti</span>
        </button>
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
      <section>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Who Paid What</h3>
        <div className="space-y-3">
          {Object.entries(payerTotals).map(([name, amount]) => (
            <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{name}</span>
              </div>
              <span className="font-mono text-cyan-300">Rp {amount.toLocaleString()}</span>
            </div>
          ))}
          {Object.keys(payerTotals).length === 0 && (
            <p className="text-center text-slate-500 py-4 text-sm">Belum ada data pengeluaran.</p>
          )}
        </div>
      </section>
    </div>
  );
}

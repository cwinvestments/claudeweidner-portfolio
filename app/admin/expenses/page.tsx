import { supabaseAdmin } from '@/lib/supabase';
import AdminNav from '../components/AdminNav';
import Link from 'next/link';
import type { Expense } from '@/lib/supabase';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

interface ExpenseWithProject extends Expense {
  projects: { id: string; name: string } | null;
}

async function getExpenses(): Promise<ExpenseWithProject[]> {
  const { data: expenses } = await supabaseAdmin
    .from('expenses')
    .select('*, projects(id, name)')
    .order('name', { ascending: true });

  return (expenses as ExpenseWithProject[]) || [];
}

function calculateMonthlyAmount(expense: Expense): number {
  switch (expense.billing_cycle) {
    case 'monthly':
      return expense.amount;
    case 'yearly':
      return expense.amount / 12;
    case 'one-time':
      return 0; // One-time expenses don't contribute to monthly
    default:
      return expense.amount;
  }
}

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  const activeExpenses = expenses.filter(e => e.is_active);
  const totalMonthly = activeExpenses.reduce((sum, e) => sum + calculateMonthlyAmount(e), 0);
  const totalYearly = activeExpenses.reduce((sum, e) => {
    if (e.billing_cycle === 'yearly') return sum + e.amount;
    if (e.billing_cycle === 'monthly') return sum + (e.amount * 12);
    return sum;
  }, 0);

  const categoryColors: Record<string, string> = {
    Hosting: 'bg-blue-600',
    Database: 'bg-green-600',
    Domain: 'bg-purple-600',
    API: 'bg-yellow-600',
    Software: 'bg-pink-600',
    Other: 'bg-gray-600',
  };

  const cycleLabels: Record<string, string> = {
    monthly: '/mo',
    yearly: '/yr',
    'one-time': 'once',
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Expenses</h1>
            <p className="text-gray-400 mt-1">{expenses.length} expenses tracked</p>
          </div>
          <Link
            href="/admin/expenses/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Expense
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Monthly Total</p>
            <p className="text-3xl font-bold text-white mt-1">${totalMonthly.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">Active recurring expenses</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Yearly Total</p>
            <p className="text-3xl font-bold text-white mt-1">${totalYearly.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">Projected annual cost</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Active Expenses</p>
            <p className="text-3xl font-bold text-white mt-1">{activeExpenses.length}</p>
            <p className="text-gray-500 text-sm mt-1">Out of {expenses.length} total</p>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No expenses tracked yet</p>
            <Link
              href="/admin/expenses/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Expense
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Name</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Category</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Project</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Amount</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Next Billing</th>
                  <th className="text-center text-gray-300 font-medium px-6 py-4">Status</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {expenses.map((expense) => (
                  <tr key={expense.id} className={`hover:bg-gray-750 ${!expense.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/expenses/${expense.id}`}
                        className="text-white font-medium hover:text-blue-400 transition"
                      >
                        {expense.name}
                      </Link>
                      {expense.notes && (
                        <p className="text-gray-500 text-sm truncate max-w-xs">{expense.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${categoryColors[expense.category]} text-white text-xs px-2 py-1 rounded-full`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {expense.projects ? (
                        <Link
                          href={`/admin/projects/${expense.projects.id}`}
                          className="hover:text-blue-400 transition"
                        >
                          {expense.projects.name}
                        </Link>
                      ) : (
                        <span className="text-gray-500">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300">
                      ${expense.amount.toFixed(2)}
                      <span className="text-gray-500 text-sm ml-1">{cycleLabels[expense.billing_cycle]}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {expense.next_billing_date ? (
                        new Date(expense.next_billing_date).toLocaleDateString()
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${expense.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {expense.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/expenses/${expense.id}`}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

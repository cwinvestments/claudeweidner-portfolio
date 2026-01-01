import { supabaseAdmin, type Project } from '@/lib/supabase';
import AdminNav from './components/AdminNav';
import Link from 'next/link';

async function getStats() {
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('status, monthly_cost, revenue');

  if (error || !projects) {
    return {
      total: 0,
      live: 0,
      development: 0,
      paused: 0,
      totalCost: 0,
      totalRevenue: 0,
    };
  }

  return {
    total: projects.length,
    live: projects.filter((p) => p.status === 'live').length,
    development: projects.filter((p) => p.status === 'development').length,
    paused: projects.filter((p) => p.status === 'paused').length,
    totalCost: projects.reduce((sum, p) => sum + (p.monthly_cost || 0), 0),
    totalRevenue: projects.reduce((sum, p) => sum + (p.revenue || 0), 0),
  };
}

async function getRecentProjects() {
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, name, slug, status, urls, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);

  return projects || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentProjects = await getRecentProjects();

  const statCards = [
    { label: 'Total Projects', value: stats.total, color: 'bg-blue-600' },
    { label: 'Live', value: stats.live, color: 'bg-green-600' },
    { label: 'In Development', value: stats.development, color: 'bg-yellow-600' },
    { label: 'Paused', value: stats.paused, color: 'bg-gray-600' },
    { label: 'Monthly Costs', value: `$${stats.totalCost.toFixed(2)}`, color: 'bg-red-600' },
    { label: 'Monthly Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your portfolio projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-xl p-4 text-white`}
            >
              <p className="text-sm opacity-80">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/projects/new"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
              >
                <span className="text-2xl">➕</span>
                <span>Add New Project</span>
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
              >
                <span className="text-2xl">📋</span>
                <span>View All Projects</span>
              </Link>
              <a
                href="/api/admin/export"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
              >
                <span className="text-2xl">💾</span>
                <span>Export Backup (JSON)</span>
              </a>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Projects</h2>
            {recentProjects.length === 0 ? (
              <p className="text-gray-400">No projects yet. Add your first project!</p>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((project: Partial<Project>) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    <div>
                      <span className="text-white font-medium">{project.name}</span>
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          project.status === 'live'
                            ? 'bg-green-600'
                            : project.status === 'development'
                            ? 'bg-yellow-600'
                            : 'bg-gray-600'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Net Position */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Financial Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Monthly Costs</p>
              <p className="text-2xl font-bold text-red-400">-${stats.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-400">+${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Net Position</p>
              <p className={`text-2xl font-bold ${stats.totalRevenue - stats.totalCost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalRevenue - stats.totalCost >= 0 ? '+' : ''}${(stats.totalRevenue - stats.totalCost).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

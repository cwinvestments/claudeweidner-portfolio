'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../components/AdminNav';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'development' as 'live' | 'development' | 'paused',
    description: '',
    notes: '',
    tech_stack: '',
    monthly_cost: '',
    revenue: '',
    urls: {
      production_url: '',
      staging_url: '',
      github_repo: '',
      netlify_dashboard: '',
      railway_dashboard: '',
      supabase_dashboard: '',
    },
    credentials: {
      admin_email: '',
      admin_password: '',
      database_connection_string: '',
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Parse tech stack
      const techStack = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Filter out empty URLs
      const urls = Object.fromEntries(
        Object.entries(formData.urls).filter(([, value]) => value)
      );

      // Filter out empty credentials
      const credentials = Object.fromEntries(
        Object.entries(formData.credentials).filter(([, value]) => value)
      );

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          status: formData.status,
          description: formData.description || null,
          notes: formData.notes || null,
          tech_stack: techStack,
          monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : 0,
          revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
          urls,
          credentials: Object.keys(credentials).length > 0 ? credentials : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      router.push(`/admin/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData({ ...formData, slug });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/admin/projects" className="text-gray-400 hover:text-white transition text-sm">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Add New Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => !formData.slug && generateSlug()}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., SnowTrack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug * <button type="button" onClick={generateSlug} className="text-blue-400 text-xs ml-2">(Generate)</button>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., snowtrack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'live' | 'development' | 'paused' })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="development">In Development</option>
                  <option value="live">Live</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack <span className="text-gray-500 text-xs">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the project..."
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">URLs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Production URL</label>
                <input
                  type="url"
                  value={formData.urls.production_url}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, production_url: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Staging URL</label>
                <input
                  type="url"
                  value={formData.urls.staging_url}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, staging_url: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://staging.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Repo</label>
                <input
                  type="url"
                  value={formData.urls.github_repo}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, github_repo: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Netlify Dashboard</label>
                <input
                  type="url"
                  value={formData.urls.netlify_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, netlify_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://app.netlify.com/sites/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Railway Dashboard</label>
                <input
                  type="url"
                  value={formData.urls.railway_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, railway_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://railway.app/project/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Supabase Dashboard</label>
                <input
                  type="url"
                  value={formData.urls.supabase_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, supabase_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://supabase.com/dashboard/project/..."
                />
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Credentials</h2>
            <p className="text-gray-400 text-sm mb-4">Stored encrypted. Only visible to you.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={formData.credentials.admin_email}
                  onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, admin_email: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
                <input
                  type="text"
                  value={formData.credentials.admin_password}
                  onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, admin_password: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Password for admin access"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Database Connection String</label>
                <input
                  type="text"
                  value={formData.credentials.database_connection_string}
                  onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, database_connection_string: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="postgresql://user:pass@host:5432/db"
                />
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Financials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthly_cost}
                  onChange={(e) => setFormData({ ...formData, monthly_cost: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Revenue ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Private Notes</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Any private notes about this project..."
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
            <Link
              href="/admin/projects"
              className="bg-gray-700 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

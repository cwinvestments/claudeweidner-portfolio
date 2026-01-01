'use client';

import { useState, useEffect, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../components/AdminNav';
import Link from 'next/link';

interface ProjectUrls {
  production_url?: string;
  staging_url?: string;
  github_repo?: string;
  netlify_dashboard?: string;
  railway_dashboard?: string;
  supabase_dashboard?: string;
}

interface ProjectCredentials {
  admin_email?: string;
  admin_password?: string;
  database_connection_string?: string;
  api_keys?: Array<{ name: string; key: string }>;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  status: 'live' | 'development' | 'paused';
  urls: ProjectUrls;
  credentials: ProjectCredentials;
  tech_stack: string[];
  description: string | null;
  notes: string | null;
  monthly_cost: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${resolvedParams.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch project');
      }

      setProject(data.project);
      setFormData({
        name: data.project.name,
        slug: data.project.slug,
        status: data.project.status,
        description: data.project.description || '',
        notes: data.project.notes || '',
        tech_stack: data.project.tech_stack?.join(', ') || '',
        monthly_cost: data.project.monthly_cost?.toString() || '',
        revenue: data.project.revenue?.toString() || '',
        urls: {
          production_url: data.project.urls?.production_url || '',
          staging_url: data.project.urls?.staging_url || '',
          github_repo: data.project.urls?.github_repo || '',
          netlify_dashboard: data.project.urls?.netlify_dashboard || '',
          railway_dashboard: data.project.urls?.railway_dashboard || '',
          supabase_dashboard: data.project.urls?.supabase_dashboard || '',
        },
        credentials: {
          admin_email: data.project.credentials?.admin_email || '',
          admin_password: data.project.credentials?.admin_password || '',
          database_connection_string: data.project.credentials?.database_connection_string || '',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const techStack = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const urls = Object.fromEntries(
        Object.entries(formData.urls).filter(([, value]) => value)
      );

      const credentials = Object.fromEntries(
        Object.entries(formData.credentials).filter(([, value]) => value)
      );

      const response = await fetch(`/api/admin/projects/${resolvedParams.id}`, {
        method: 'PUT',
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
          credentials: Object.keys(credentials).length > 0 ? credentials : {},
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project');
      }

      setProject(data.project);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/projects/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-300">{error || 'Project not found'}</p>
            <Link href="/admin/projects" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/projects" className="text-gray-400 hover:text-white transition text-sm">
              ← Back to Projects
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4">{project.name}</h1>
            <p className="text-gray-400 mt-1">Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Project'}
          </button>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
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
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">URLs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(formData.urls).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, [key]: e.target.value } })}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {value && (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Credentials</h2>
                <p className="text-gray-400 text-sm">Stored encrypted</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {showCredentials ? 'Hide' : 'Show'} credentials
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
                <div className="flex gap-2">
                  <input
                    type={showCredentials ? 'text' : 'password'}
                    value={formData.credentials.admin_email}
                    onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, admin_email: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {formData.credentials.admin_email && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.credentials.admin_email, 'email')}
                      className="bg-gray-700 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition"
                    >
                      {copied === 'email' ? '✓' : '📋'}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
                <div className="flex gap-2">
                  <input
                    type={showCredentials ? 'text' : 'password'}
                    value={formData.credentials.admin_password}
                    onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, admin_password: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {formData.credentials.admin_password && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.credentials.admin_password, 'password')}
                      className="bg-gray-700 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition"
                    >
                      {copied === 'password' ? '✓' : '📋'}
                    </button>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Database Connection String</label>
                <div className="flex gap-2">
                  <input
                    type={showCredentials ? 'text' : 'password'}
                    value={formData.credentials.database_connection_string}
                    onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, database_connection_string: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                  {formData.credentials.database_connection_string && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.credentials.database_connection_string, 'db')}
                      className="bg-gray-700 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition"
                    >
                      {copied === 'db' ? '✓' : '📋'}
                    </button>
                  )}
                </div>
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
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
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

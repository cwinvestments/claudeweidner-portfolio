'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminNav from '../../components/AdminNav';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  company: string | null;
}

interface GeneralCredential {
  id: string;
  service_name: string;
  url: string;
  username: string;
  password: string;
  notes: string;
}

function NewProjectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [clients, setClients] = useState<Client[]>([]);

  const initialClientId = searchParams.get('client_id') || '';

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'development' as 'live' | 'development' | 'paused',
    project_type: initialClientId ? 'client' : 'personal' as 'personal' | 'client',
    client_id: initialClientId,
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
      github: { username: '', password: '' },
      netlify: { email: '', password: '' },
      railway: { email: '', password: '' },
      supabase: { email: '', password: '', database_password: '' },
      general: [] as GeneralCredential[],
    },
  });

  // Fetch clients for dropdown
  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch('/api/admin/clients?active=true');
        const data = await response.json();
        if (response.ok) {
          setClients(data.clients || []);
        }
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      }
    }
    fetchClients();
  }, []);

  const togglePassword = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const addGeneralCredential = () => {
    const newCred: GeneralCredential = {
      id: crypto.randomUUID(),
      service_name: '',
      url: '',
      username: '',
      password: '',
      notes: '',
    };
    setFormData({
      ...formData,
      credentials: {
        ...formData.credentials,
        general: [...formData.credentials.general, newCred],
      },
    });
  };

  const updateGeneralCredential = (id: string, field: keyof GeneralCredential, value: string) => {
    setFormData({
      ...formData,
      credentials: {
        ...formData.credentials,
        general: formData.credentials.general.map(cred =>
          cred.id === id ? { ...cred, [field]: value } : cred
        ),
      },
    });
  };

  const removeGeneralCredential = (id: string) => {
    setFormData({
      ...formData,
      credentials: {
        ...formData.credentials,
        general: formData.credentials.general.filter(cred => cred.id !== id),
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const techStack = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Filter out empty URLs
      const urls = Object.fromEntries(
        Object.entries(formData.urls).filter(([, value]) => value)
      );

      // Build credentials object, only including non-empty values
      const credentials: Record<string, unknown> = {};

      // GitHub
      if (formData.credentials.github.username || formData.credentials.github.password) {
        credentials.github = {
          ...(formData.credentials.github.username && { username: formData.credentials.github.username }),
          ...(formData.credentials.github.password && { password: formData.credentials.github.password }),
        };
      }

      // Netlify
      if (formData.credentials.netlify.email || formData.credentials.netlify.password) {
        credentials.netlify = {
          ...(formData.credentials.netlify.email && { email: formData.credentials.netlify.email }),
          ...(formData.credentials.netlify.password && { password: formData.credentials.netlify.password }),
        };
      }

      // Railway
      if (formData.credentials.railway.email || formData.credentials.railway.password) {
        credentials.railway = {
          ...(formData.credentials.railway.email && { email: formData.credentials.railway.email }),
          ...(formData.credentials.railway.password && { password: formData.credentials.railway.password }),
        };
      }

      // Supabase
      if (formData.credentials.supabase.email || formData.credentials.supabase.password || formData.credentials.supabase.database_password) {
        credentials.supabase = {
          ...(formData.credentials.supabase.email && { email: formData.credentials.supabase.email }),
          ...(formData.credentials.supabase.password && { password: formData.credentials.supabase.password }),
          ...(formData.credentials.supabase.database_password && { database_password: formData.credentials.supabase.database_password }),
        };
      }

      // General credentials
      const validGeneralCreds = formData.credentials.general.filter(
        cred => cred.service_name || cred.username || cred.password
      );
      if (validGeneralCreds.length > 0) {
        credentials.general = validGeneralCreds;
      }

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          status: formData.status,
          project_type: formData.project_type,
          client_id: formData.project_type === 'client' ? formData.client_id || null : null,
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

  // Reusable credential field component
  const CredentialField = ({
    label,
    value,
    onChange,
    fieldKey,
    type = 'text',
    placeholder = '',
    isPassword = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    fieldKey: string;
    type?: string;
    placeholder?: string;
    isPassword?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type={isPassword && !showPasswords[fieldKey] ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => togglePassword(fieldKey)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition text-sm"
            title={showPasswords[fieldKey] ? 'Hide' : 'Show'}
          >
            {showPasswords[fieldKey] ? '🙈' : '👁️'}
          </button>
        )}
        <button
          type="button"
          onClick={() => copyToClipboard(value, fieldKey)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition text-sm"
          title="Copy"
        >
          {copied === fieldKey ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );

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
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    project_type: e.target.value as 'personal' | 'client',
                    client_id: e.target.value === 'personal' ? '' : formData.client_id
                  })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="personal">Personal Project</option>
                  <option value="client">Client Project</option>
                </select>
              </div>
              {formData.project_type === 'client' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}{client.company ? ` (${client.company})` : ''}
                      </option>
                    ))}
                  </select>
                  {clients.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      No clients found. <Link href="/admin/clients/new" className="text-blue-400 hover:underline">Add a client</Link>
                    </p>
                  )}
                </div>
              )}
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

          {/* Production & Staging URLs */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Application URLs</h2>
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
            </div>
          </div>

          {/* GitHub */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">GitHub</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Repository URL</label>
                <input
                  type="url"
                  value={formData.urls.github_repo}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, github_repo: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CredentialField
                  label="Username"
                  value={formData.credentials.github.username}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, github: { ...formData.credentials.github, username: v } } })}
                  fieldKey="github_username"
                  placeholder="GitHub username"
                />
                <CredentialField
                  label="Token / Password"
                  value={formData.credentials.github.password}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, github: { ...formData.credentials.github, password: v } } })}
                  fieldKey="github_password"
                  placeholder="Personal access token"
                  isPassword
                />
              </div>
            </div>
          </div>

          {/* Netlify */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Netlify</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dashboard URL</label>
                <input
                  type="url"
                  value={formData.urls.netlify_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, netlify_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://app.netlify.com/sites/..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CredentialField
                  label="Email"
                  value={formData.credentials.netlify.email}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, netlify: { ...formData.credentials.netlify, email: v } } })}
                  fieldKey="netlify_email"
                  placeholder="Netlify account email"
                />
                <CredentialField
                  label="Password"
                  value={formData.credentials.netlify.password}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, netlify: { ...formData.credentials.netlify, password: v } } })}
                  fieldKey="netlify_password"
                  placeholder="Netlify password"
                  isPassword
                />
              </div>
            </div>
          </div>

          {/* Railway */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Railway</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dashboard URL</label>
                <input
                  type="url"
                  value={formData.urls.railway_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, railway_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://railway.app/project/..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CredentialField
                  label="Email"
                  value={formData.credentials.railway.email}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, railway: { ...formData.credentials.railway, email: v } } })}
                  fieldKey="railway_email"
                  placeholder="Railway account email"
                />
                <CredentialField
                  label="Password"
                  value={formData.credentials.railway.password}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, railway: { ...formData.credentials.railway, password: v } } })}
                  fieldKey="railway_password"
                  placeholder="Railway password"
                  isPassword
                />
              </div>
            </div>
          </div>

          {/* Supabase */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Supabase</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dashboard URL</label>
                <input
                  type="url"
                  value={formData.urls.supabase_dashboard}
                  onChange={(e) => setFormData({ ...formData, urls: { ...formData.urls, supabase_dashboard: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://supabase.com/dashboard/project/..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CredentialField
                  label="Email"
                  value={formData.credentials.supabase.email}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, supabase: { ...formData.credentials.supabase, email: v } } })}
                  fieldKey="supabase_email"
                  placeholder="Supabase account email"
                />
                <CredentialField
                  label="Password"
                  value={formData.credentials.supabase.password}
                  onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, supabase: { ...formData.credentials.supabase, password: v } } })}
                  fieldKey="supabase_password"
                  placeholder="Supabase password"
                  isPassword
                />
              </div>
              <CredentialField
                label="Database Password"
                value={formData.credentials.supabase.database_password}
                onChange={(v) => setFormData({ ...formData, credentials: { ...formData.credentials, supabase: { ...formData.credentials.supabase, database_password: v } } })}
                fieldKey="supabase_db_password"
                placeholder="Database password"
                isPassword
              />
            </div>
          </div>

          {/* General Credentials */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">General Credentials</h2>
                <p className="text-gray-400 text-sm">Other logins related to this project</p>
              </div>
              <button
                type="button"
                onClick={addGeneralCredential}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                + Add Credential
              </button>
            </div>

            {formData.credentials.general.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No general credentials added yet</p>
            ) : (
              <div className="space-y-6">
                {formData.credentials.general.map((cred, index) => (
                  <div key={cred.id} className="bg-gray-750 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm">Credential #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeGeneralCredential(cred.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Service Name *</label>
                        <input
                          type="text"
                          value={cred.service_name}
                          onChange={(e) => updateGeneralCredential(cred.id, 'service_name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="e.g., AWS, Stripe, SendGrid"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">URL (optional)</label>
                        <input
                          type="url"
                          value={cred.url}
                          onChange={(e) => updateGeneralCredential(cred.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="https://..."
                        />
                      </div>
                      <CredentialField
                        label="Username / Email"
                        value={cred.username}
                        onChange={(v) => updateGeneralCredential(cred.id, 'username', v)}
                        fieldKey={`general_${cred.id}_username`}
                        placeholder="Username or email"
                      />
                      <CredentialField
                        label="Password / API Key"
                        value={cred.password}
                        onChange={(v) => updateGeneralCredential(cred.id, 'password', v)}
                        fieldKey={`general_${cred.id}_password`}
                        placeholder="Password or API key"
                        isPassword
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                        <input
                          type="text"
                          value={cred.notes}
                          onChange={(e) => updateGeneralCredential(cred.id, 'notes', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Any additional notes..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default function NewProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <NewProjectPageContent />
    </Suspense>
  );
}

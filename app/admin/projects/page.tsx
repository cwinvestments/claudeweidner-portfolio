import { supabaseAdmin } from '@/lib/supabase';
import AdminNav from '../components/AdminNav';
import Link from 'next/link';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

async function getProjects() {
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, name, slug, status, project_type, urls, monthly_cost, revenue, updated_at, clients(id, name)')
    .order('name', { ascending: true });

  return projects || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const statusColors: Record<string, string> = {
    live: 'bg-green-600',
    development: 'bg-yellow-600',
    paused: 'bg-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">{projects.length} projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Project
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Name</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Status</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">URLs</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Monthly Cost</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Revenue</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-white font-medium hover:text-blue-400 transition"
                      >
                        {project.name}
                      </Link>
                      <p className="text-gray-500 text-sm">{project.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${statusColors[project.status]} text-white text-xs px-2 py-1 rounded-full`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {project.urls?.production_url && (
                          <a
                            href={project.urls.production_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                            title="Production"
                          >
                            🌐
                          </a>
                        )}
                        {project.urls?.github_repo && (
                          <a
                            href={project.urls.github_repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                            title="GitHub"
                          >
                            📦
                          </a>
                        )}
                        {project.urls?.netlify_dashboard && (
                          <a
                            href={project.urls.netlify_dashboard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                            title="Netlify"
                          >
                            🚀
                          </a>
                        )}
                        {project.urls?.railway_dashboard && (
                          <a
                            href={project.urls.railway_dashboard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                            title="Railway"
                          >
                            🚂
                          </a>
                        )}
                        {project.urls?.supabase_dashboard && (
                          <a
                            href={project.urls.supabase_dashboard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                            title="Supabase"
                          >
                            🗄️
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300">
                      ${(project.monthly_cost || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300">
                      ${(project.revenue || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit →
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

import { supabaseAdmin } from '@/lib/supabase';
import AdminNav from '../components/AdminNav';
import Link from 'next/link';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

interface ClientWithProjectCount {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  projects: { id: string }[];
}

async function getClients(): Promise<ClientWithProjectCount[]> {
  const { data: clients } = await supabaseAdmin
    .from('clients')
    .select('id, name, company, email, phone, is_active, projects(id)')
    .order('name', { ascending: true });

  return (clients as ClientWithProjectCount[]) || [];
}

export default async function ClientsPage() {
  const clients = await getClients();

  const activeClients = clients.filter((c) => c.is_active).length;
  const totalProjects = clients.reduce((sum, c) => sum + (c.projects?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
            <p className="text-gray-400 mt-1">
              {clients.length} clients ({activeClients} active) · {totalProjects} projects
            </p>
          </div>
          <Link
            href="/admin/clients/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Client
          </Link>
        </div>

        {clients.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No clients yet</p>
            <Link
              href="/admin/clients/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Client
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Name</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Company</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Contact</th>
                  <th className="text-center text-gray-300 font-medium px-6 py-4">Projects</th>
                  <th className="text-center text-gray-300 font-medium px-6 py-4">Status</th>
                  <th className="text-right text-gray-300 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="text-white font-medium hover:text-blue-400 transition"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {client.company || <span className="text-gray-500">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {client.email && (
                          <a
                            href={`mailto:${client.email}`}
                            className="text-gray-300 hover:text-white block"
                          >
                            {client.email}
                          </a>
                        )}
                        {client.phone && (
                          <a
                            href={`tel:${client.phone}`}
                            className="text-gray-400 hover:text-white block"
                          >
                            {client.phone}
                          </a>
                        )}
                        {!client.email && !client.phone && (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-300">
                        {client.projects?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          client.is_active
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {client.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
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

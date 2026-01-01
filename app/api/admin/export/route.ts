import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { decryptCredentials } from '@/lib/encryption';
import type { ProjectCredentials } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching projects for export:', error);
      return NextResponse.json(
        { error: 'Failed to export data' },
        { status: 500 }
      );
    }

    // Decrypt all credentials
    const decryptedProjects = projects.map((project) => {
      try {
        if (project.credentials && typeof project.credentials === 'string') {
          project.credentials = decryptCredentials<ProjectCredentials>(project.credentials);
        }
      } catch {
        project.credentials = { error: 'Failed to decrypt' };
      }
      return project;
    });

    const exportData = {
      exported_at: new Date().toISOString(),
      total_projects: projects.length,
      projects: decryptedProjects,
    };

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

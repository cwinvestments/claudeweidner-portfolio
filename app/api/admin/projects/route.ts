import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, type ProjectInsert } from '@/lib/supabase';
import { encryptCredentials, decryptCredentials } from '@/lib/encryption';
import type { ProjectCredentials } from '@/lib/supabase';

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectType = searchParams.get('type'); // 'personal' or 'client'
    const clientId = searchParams.get('client_id');

    let query = supabaseAdmin
      .from('projects')
      .select('*, clients(id, name, company)')
      .order('name', { ascending: true });

    if (projectType === 'personal' || projectType === 'client') {
      query = query.eq('project_type', projectType);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Decrypt credentials for each project
    const decryptedProjects = projects.map((project) => {
      try {
        if (project.credentials && typeof project.credentials === 'string') {
          project.credentials = decryptCredentials<ProjectCredentials>(project.credentials);
        }
      } catch {
        // If decryption fails, return empty credentials
        project.credentials = {};
      }
      return project;
    });

    return NextResponse.json({ projects: decryptedProjects });
  } catch (error) {
    console.error('Error in GET /api/admin/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      status = 'development',
      project_type = 'personal',
      client_id = null,
      urls = {},
      credentials = {},
      tech_stack = [],
      description,
      notes,
      monthly_cost = 0,
      revenue = 0,
    } = body as ProjectInsert & { credentials?: ProjectCredentials };

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase letters, numbers, and hyphens only' },
        { status: 400 }
      );
    }

    // Validate project_type
    if (project_type !== 'personal' && project_type !== 'client') {
      return NextResponse.json(
        { error: 'Project type must be "personal" or "client"' },
        { status: 400 }
      );
    }

    // Validate client_id if project is client type
    if (project_type === 'client' && client_id) {
      const { data: clientExists } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('id', client_id)
        .single();

      if (!clientExists) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate slug
    const { data: existing } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }

    // Encrypt credentials
    const encryptedCredentials = Object.keys(credentials).length > 0
      ? encryptCredentials(credentials)
      : null;

    // Insert project
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        slug,
        status,
        project_type,
        client_id: project_type === 'client' ? client_id : null,
        urls,
        credentials: encryptedCredentials,
        tech_stack,
        description,
        notes,
        monthly_cost,
        revenue,
      })
      .select('*, clients(id, name, company)')
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    // Return project with decrypted credentials
    if (project.credentials) {
      try {
        project.credentials = decryptCredentials<ProjectCredentials>(project.credentials);
      } catch {
        project.credentials = {};
      }
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

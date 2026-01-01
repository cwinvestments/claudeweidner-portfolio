import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encryptCredentials, decryptCredentials } from '@/lib/encryption';
import type { ProjectCredentials } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*, clients(id, name, company)')
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Decrypt credentials
    if (project.credentials && typeof project.credentials === 'string') {
      try {
        project.credentials = decryptCredentials<ProjectCredentials>(project.credentials);
      } catch {
        project.credentials = {};
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error in GET /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug,
      status,
      project_type,
      client_id,
      urls,
      credentials,
      tech_stack,
      description,
      notes,
      monthly_cost,
      revenue,
    } = body;

    // Check project exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check for duplicates
    if (slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must be lowercase letters, numbers, and hyphens only' },
          { status: 400 }
        );
      }

      const { data: slugExists } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Validate project_type if provided
    if (project_type !== undefined && project_type !== 'personal' && project_type !== 'client') {
      return NextResponse.json(
        { error: 'Project type must be "personal" or "client"' },
        { status: 400 }
      );
    }

    // Validate client_id if provided
    if (client_id !== undefined && client_id !== null) {
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

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (status !== undefined) updateData.status = status;
    if (project_type !== undefined) updateData.project_type = project_type;
    if (client_id !== undefined) {
      // If changing to personal, clear client_id
      updateData.client_id = project_type === 'personal' ? null : client_id;
    }
    if (urls !== undefined) updateData.urls = urls;
    if (tech_stack !== undefined) updateData.tech_stack = tech_stack;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;
    if (monthly_cost !== undefined) updateData.monthly_cost = monthly_cost;
    if (revenue !== undefined) updateData.revenue = revenue;

    // Encrypt credentials if provided
    if (credentials !== undefined) {
      updateData.credentials = Object.keys(credentials).length > 0
        ? encryptCredentials(credentials)
        : null;
    }

    // Update project
    const { data: project, error: updateError } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*, clients(id, name, company)')
      .single();

    if (updateError) {
      console.error('Error updating project:', updateError);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    // Decrypt credentials for response
    if (project.credentials && typeof project.credentials === 'string') {
      try {
        project.credentials = decryptCredentials<ProjectCredentials>(project.credentials);
      } catch {
        project.credentials = {};
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error in PUT /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

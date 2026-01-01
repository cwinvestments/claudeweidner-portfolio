import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, type ClientInsert } from '@/lib/supabase';

// GET all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const withProjects = searchParams.get('with_projects') === 'true';

    let query = supabaseAdmin
      .from('clients')
      .select(withProjects ? '*, projects(id, name, status, project_type)' : '*')
      .order('name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: clients, error } = await query;

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error in GET /api/admin/clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      company = null,
      email = null,
      phone = null,
      address = null,
      website = null,
      notes = null,
      is_active = true,
    } = body as ClientInsert;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert client
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .insert({
        name,
        company,
        email,
        phone,
        address,
        website,
        notes,
        is_active,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json(
        { error: 'Failed to create client' },
        { status: 500 }
      );
    }

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

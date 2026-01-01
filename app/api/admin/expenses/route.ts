import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, type ExpenseInsert, type ExpenseCategory, type BillingCycle } from '@/lib/supabase';

const VALID_CATEGORIES: ExpenseCategory[] = ['Hosting', 'Database', 'Domain', 'API', 'Software', 'Other'];
const VALID_BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly', 'one-time'];

// GET all expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const projectId = searchParams.get('project_id');

    let query = supabaseAdmin
      .from('expenses')
      .select('*, projects(id, name)')
      .order('name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: expenses, error } = await query;

    if (error) {
      console.error('Error fetching expenses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error in GET /api/admin/expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id = null,
      name,
      category,
      amount,
      billing_cycle = 'monthly',
      next_billing_date = null,
      notes = null,
      is_active = true,
    } = body as ExpenseInsert;

    // Validate required fields
    if (!name || !category || amount === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and amount are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate billing cycle
    if (!VALID_BILLING_CYCLES.includes(billing_cycle)) {
      return NextResponse.json(
        { error: `Invalid billing cycle. Must be one of: ${VALID_BILLING_CYCLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be a non-negative number' },
        { status: 400 }
      );
    }

    // If project_id provided, validate it exists
    if (project_id) {
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('id', project_id)
        .single();

      if (projectError || !project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 400 }
        );
      }
    }

    // Insert expense
    const { data: expense, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        project_id,
        name,
        category,
        amount,
        billing_cycle,
        next_billing_date,
        notes,
        is_active,
      })
      .select('*, projects(id, name)')
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

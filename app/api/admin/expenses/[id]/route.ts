import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, type ExpenseCategory, type BillingCycle } from '@/lib/supabase';

const VALID_CATEGORIES: ExpenseCategory[] = ['Hosting', 'Database', 'Domain', 'API', 'Software', 'Other'];
const VALID_BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly', 'one-time'];

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single expense
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: expense, error } = await supabaseAdmin
      .from('expenses')
      .select('*, projects(id, name)')
      .eq('id', id)
      .single();

    if (error || !expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Error in GET /api/admin/expenses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update expense
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      project_id,
      name,
      category,
      amount,
      billing_cycle,
      next_billing_date,
      notes,
      is_active,
    } = body;

    // Check expense exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('expenses')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate billing cycle if provided
    if (billing_cycle !== undefined && !VALID_BILLING_CYCLES.includes(billing_cycle)) {
      return NextResponse.json(
        { error: `Invalid billing cycle. Must be one of: ${VALID_BILLING_CYCLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount if provided
    if (amount !== undefined && (typeof amount !== 'number' || amount < 0)) {
      return NextResponse.json(
        { error: 'Amount must be a non-negative number' },
        { status: 400 }
      );
    }

    // If project_id provided and not null, validate it exists
    if (project_id !== undefined && project_id !== null) {
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

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {};

    if (project_id !== undefined) updateData.project_id = project_id;
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (amount !== undefined) updateData.amount = amount;
    if (billing_cycle !== undefined) updateData.billing_cycle = billing_cycle;
    if (next_billing_date !== undefined) updateData.next_billing_date = next_billing_date;
    if (notes !== undefined) updateData.notes = notes;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update expense
    const { data: expense, error: updateError } = await supabaseAdmin
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select('*, projects(id, name)')
      .single();

    if (updateError) {
      console.error('Error updating expense:', updateError);
      return NextResponse.json(
        { error: 'Failed to update expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Error in PUT /api/admin/expenses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE expense
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      return NextResponse.json(
        { error: 'Failed to delete expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/expenses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

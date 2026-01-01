import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Temporary debug endpoint - REMOVE AFTER DEBUGGING
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    // Check if admin_users table exists and has data
    const { data: users, error: listError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, created_at')
      .limit(10);

    if (listError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to query admin_users table',
        error: listError.message,
        hint: listError.hint,
        code: listError.code,
      });
    }

    // Check for specific user
    const { data: user, error: userError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, password_hash, created_at')
      .eq('email', email.toLowerCase())
      .single();

    return NextResponse.json({
      status: 'ok',
      table_has_users: users?.length || 0,
      all_users: users?.map(u => ({ id: u.id, email: u.email })),
      specific_user_found: !!user,
      specific_user: user ? {
        id: user.id,
        email: user.email,
        has_password_hash: !!user.password_hash,
        password_hash_length: user.password_hash?.length,
        password_hash_prefix: user.password_hash?.substring(0, 10) + '...',
        created_at: user.created_at,
      } : null,
      user_error: userError?.message || null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'exception',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

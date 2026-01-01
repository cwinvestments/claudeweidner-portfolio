import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

// This endpoint creates the initial admin user
// It should only work once (when no admin users exist)

export async function POST(request: NextRequest) {
  try {
    // Check if any admin users exist
    const { count, error: countError } = await supabaseAdmin
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking admin users:', countError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Admin user already exists. Use password reset instead.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, setupKey } = body;

    // Require a setup key for security
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 12) {
      return NextResponse.json(
        { error: 'Password must be at least 12 characters' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const { data: user, error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating admin user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

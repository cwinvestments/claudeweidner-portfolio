import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword, createSession } from '@/lib/auth';

// Rate limiting store (should match middleware)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_DURATION });
  } else {
    record.count++;
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('[LOGIN] Attempting login for email:', email.toLowerCase());

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    console.log('[LOGIN] Supabase query result - user found:', !!user, 'error:', error?.message || 'none');

    if (error || !user) {
      console.log('[LOGIN] FAILED: User not found in database');
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid email or password', debug: 'user_not_found' },
        { status: 401 }
      );
    }

    console.log('[LOGIN] User found with id:', user.id);
    console.log('[LOGIN] Password hash exists:', !!user.password_hash);
    console.log('[LOGIN] Password hash length:', user.password_hash?.length);

    // Verify password
    let isValid = false;
    try {
      isValid = await verifyPassword(password, user.password_hash);
      console.log('[LOGIN] Password verification result:', isValid);
    } catch (verifyError) {
      console.error('[LOGIN] Password verification threw error:', verifyError);
      throw verifyError;
    }

    if (!isValid) {
      console.log('[LOGIN] FAILED: Password mismatch');
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid email or password', debug: 'password_mismatch' },
        { status: 401 }
      );
    }

    // Clear rate limiting on successful login
    clearAttempts(ip);

    // Create session
    console.log('[LOGIN] Creating JWT session...');
    const token = await createSession(user.id, user.email);
    console.log('[LOGIN] JWT created successfully, length:', token.length);

    // Create response with cookie set directly
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    // Set cookie on response object (more reliable than cookies() in Route Handlers)
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

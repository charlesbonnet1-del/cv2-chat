import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '../lib/emailVerifier';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        email: '',
        valid: false,
        status: 'missing_email',
        confidence: 'low',
        details: 'Email parameter required'
      }, { status: 400 });
    }

    const result = await verifyEmail(email);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      email: '',
      valid: false,
      status: 'error',
      confidence: 'low',
      details: 'Verification error',
      provider: 'none'
    }, { status: 500 });
  }
}

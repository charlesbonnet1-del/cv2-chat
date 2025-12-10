import { NextResponse } from 'next/server';
import { getProvidersStatus } from '../lib/emailVerifier';

export async function GET() {
  try {
    const status = getProvidersStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting providers status:', error);
    return NextResponse.json([], { status: 500 });
  }
}

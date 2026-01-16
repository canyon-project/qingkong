import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/auth-actions';

export async function GET() {
  const result = await getCurrentUser();
  if (result.success) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

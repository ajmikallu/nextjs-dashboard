import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { canUserAccess } from '@/app/lib/rbac';

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const canRead = await canUserAccess(session.user.email, 'invoices', 'read');
  
  if (!canRead) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Return invoices
  return NextResponse.json({ invoices: [] });
}
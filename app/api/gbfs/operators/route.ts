import { NextResponse } from 'next/server';
import { GBFS_OPERATORS } from '@/lib/gbfs-operators';

export async function GET() {
  return NextResponse.json({
    operators: GBFS_OPERATORS,
  });
}

import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  // process.cwd() is /Users/jackson/Codes/moon-escape/moon-app
  const workspaceRoot = path.resolve(process.cwd(), '..');
  return NextResponse.json({ workspaceRoot });
}

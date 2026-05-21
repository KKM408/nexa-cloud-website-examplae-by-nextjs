import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tag: string = body.tag ?? 'posts';

  revalidateTag(tag, 'default');
  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}

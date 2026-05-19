// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email, and message are required' },
      { status: 422 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 422 });
  }

  console.log('Contact form submission:', { name, email, message });

  return NextResponse.json(
    { success: true, message: 'Message received. We will get back to you within 24 hours.' },
    { status: 200 }
  );
}

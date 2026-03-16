import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body || {};

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const lead = {
      name,
      email,
      company: company || '',
      message: message || '',
      notifiedEmail: 'eking.pt@gmail.com',
      createdAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'leads.json');

    await fs.mkdir(dataDir, { recursive: true });

    let existing = [];
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      existing = JSON.parse(raw);
    } catch {}

    existing.unshift(lead);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({
      ok: true,
      message:
        'Lead captured. Next step: connect Resend or another mail provider to send instant notifications to eking.pt@gmail.com.',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to capture submission.' }, { status: 500 });
  }
}

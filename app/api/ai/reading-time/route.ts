import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { withAnthropicRetry } from '@/lib/retry';

const client = new Anthropic();
const WPM: Record<string, number> = { light: 220, medium: 200, dense: 160 };

export async function POST(request: NextRequest) {
  try {
    const { content, wordCount } = (await request.json()) as {
      content?: string;
      wordCount?: number;
    };

    if (!content && !wordCount) {
      return NextResponse.json({ error: 'content or wordCount required' }, { status: 400 });
    }

    if (!content) {
      const wc = wordCount ?? 0;
      const minutes = Math.max(1, Math.ceil(wc / WPM.medium));
      return NextResponse.json({ density: 'medium', minutes, label: `${minutes} min read` });
    }

    const sample = content.split(' ').slice(0, 600).join(' ');
    const wc = wordCount ?? content.split(/\s+/).length;

    const message = await withAnthropicRetry(() =>
      client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: `Classify this text as exactly one word: light, medium, or dense.
light = narrative/conversational. medium = balanced. dense = technical/jargon/code-heavy.

Text:
${sample}

Respond with one word only:`,
          },
        ],
      })
    );

    const raw =
      message.content[0].type === 'text' ? message.content[0].text.toLowerCase().trim() : 'medium';
    const density = (['light', 'medium', 'dense'] as const).includes(raw as 'light' | 'medium' | 'dense')
      ? (raw as 'light' | 'medium' | 'dense')
      : 'medium';
    const minutes = Math.max(1, Math.ceil(wc / WPM[density]));
    const label = density === 'dense' ? `${minutes} min · technical read` : `${minutes} min read`;

    return NextResponse.json({ density, minutes, label, wpm: WPM[density] });
  } catch (err) {
    console.error('[reading-time]', err);
    return NextResponse.json({ error: 'Failed to classify' }, { status: 500 });
  }
}

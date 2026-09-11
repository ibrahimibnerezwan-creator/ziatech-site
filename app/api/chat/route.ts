import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { text: "Hello! Our AI assistant is resting, but you can message us directly on WhatsApp at +880 1712-345678 for instant tech support!" },
      { status: 200 }
    );
  }

  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch store catalog for live context
    const allProducts = await db.query.products.findMany({
      limit: 50,
      with: { category: true },
    });

    const catalogContext = allProducts.map(p => 
      `- ${p.name} (Category: ${p.category?.name || 'General'}, Price: ৳${p.price}, Stock: ${p.stock > 0 ? `${p.stock} available` : 'Out of stock'}${p.description ? `, Summary: ${p.description.slice(0, 100)}` : ''})`
    ).join('\n');

    const systemPrompt = `You are ZiaTech Assistant, an expert, adorable, and extremely helpful electronics engineer and customer assistant at "Zia's Tech Shop" (ziatech.shop) in Bangladesh.
You assist robotics hobbyists, university engineering students (BUET, DU, BRAC, etc.), and makers.

STORE CONTEXT:
- Delivery: Nationwide in Bangladesh via Steadfast Courier. Inside Dhaka: ৳60 (24-48h). Suburbs: ৳100. Outside Dhaka: ৳120 (48-72h).
- Payment: Cash on Delivery (COD), bKash, Nagad.
- WhatsApp Hotline: +880 1712-345678.
- 100% genuine, tested hardware parts with easy replacement warranty.

LIVE CATALOG:
${catalogContext}

BEHAVIOR RULES:
1. You can communicate fluently in English, Bengali (বাংলা), and Banglish (Bengali written in English letters). Always match the customer's language.
2. Provide concise, friendly, and practical engineering advice (e.g., pinouts, recommended voltages, sensor wiring, resistor values).
3. If they ask about buying or pricing, reference exact prices and stock from the live catalog.
4. If a component isn't in stock or in catalog, politely explain and offer the closest alternative or direct them to our WhatsApp for pre-orders.
5. Keep answers concise, formatted with clear bullets if explaining steps, and maintain a lovely, encouraging maker spirit!`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build chat history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
      { role: 'user', parts: [{ text: `System Instruction:\n${systemPrompt}` }] },
      { role: 'model', parts: [{ text: 'Understood! I am ready to guide makers, engineers, and customers at ZiaTech with technical expertise, warmth, and accuracy.' }] },
    ];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role === 'user' || h.role === 'model') {
          contents.push({ role: h.role, parts: [{ text: h.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await model.generateContent({ contents });
    const replyText = response.response.text();

    return NextResponse.json({ text: replyText });
  } catch (error: any) {
    console.error('Chat AI error:', error);
    return NextResponse.json(
      { text: "I'm having a brief connection glitch! Please feel free to message our team on WhatsApp at +880 1712-345678 for instant help." },
      { status: 200 }
    );
  }
}

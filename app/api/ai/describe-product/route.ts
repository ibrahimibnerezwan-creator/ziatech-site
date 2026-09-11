import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isAuthenticatedAdmin } from '@/lib/auth';

const PROMPT = `You are a specialized technical hardware assistant for Zia's Tech Shop (ziatech.shop), Bangladesh's premier e-commerce shop for electronics, robotics, microcontrollers, sensors, IoT modules, and maker tools.

Analyze this electronic product/component image carefully and return a JSON object with:
- title: Precise, clean component name in English (2-6 words). E.g. "ESP32 NodeMCU WiFi & Bluetooth Board", "Arduino Uno R4 Minima", "HC-SR04 Ultrasonic Distance Sensor", "SG90 Micro Servo Motor 9g"
- description: 2-3 sentences explaining its features, operating voltage/specs, and common project uses for Bangladeshi engineering students, robotics hobbyists, and makers.
- category: Pick the best matching category from: Microcontrollers, Sensors & Modules, Robotics & Motors, Displays, Power & Batteries, Tools & Accessories, Components
- specs: 3-5 key technical bullet specs as a key-value object (e.g. {"Operating Voltage": "3.3V - 5V", "Interface": "I2C / SPI", "Processor": "Xtensa dual-core 32-bit LX6"})

Respond ONLY with valid JSON. No markdown, no backticks.
Example:
{"title":"ESP32-WROOM-32 Development Board","description":"High-performance WiFi and Bluetooth dual-mode microcontroller board ideal for IoT and automation projects. Features 38 GPIO pins and ultra-low power consumption.","category":"Microcontrollers","specs":{"Operating Voltage":"3.3V - 5V DC","Wireless":"WiFi 802.11 b/g/n + BLE 4.2","Flash Memory":"4MB","Clock Speed":"240 MHz"}}`;

export async function POST(req: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent([
      { text: PROMPT },
      { inlineData: { mimeType, data: imageBase64 } },
    ]);

    const responseText = result.response.text();
    let parsed: any;
    try {
      const clean = responseText.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI output' }, { status: 422 });
    }

    return NextResponse.json({
      title: parsed.title || '',
      description: parsed.description || '',
      category: parsed.category || 'Components',
      specs: parsed.specs || {},
    });
  } catch (error: any) {
    console.error('Gemini Vision error:', error);
    return NextResponse.json(
      { error: error.message || 'AI could not analyze this hardware image' },
      { status: 500 }
    );
  }
}

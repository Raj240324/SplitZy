import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response('Missing image', { status: 400 });
    }

    // Process the base64 image
    const base64Data = image.split(',')[1];

    /**
     * VERCEL AI GATEWAY CONFIGURATION
     * Make sure 'splitzy-gateway' matches your Gateway ID/Slug in Vercel.
     */
    const googleProxy = createGoogleGenerativeAI({
      baseURL: "https://gateway.vercel.ai/v1",
      headers: {
        "x-vercel-ai-gateway-id": "splitzy-gateway", // UPDATE THIS IF YOUR SLUG IS DIFFERENT
        "Authorization": `Bearer ${process.env.VERCEL_AI_GATEWAY_API_KEY}`,
      },
    });

    const result = await generateObject({
      model: googleProxy('gemini-1.5-flash'), 
      schema: z.object({
        amount: z.number().optional().describe('The total amount of the bill/receipt'),
        title: z.string().optional().describe('The name of the merchant or store'),
      }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the total amount and merchant name from this receipt. If you can only find an estimated total, provide that.' },
            { type: 'image', image: base64Data },
          ],
        },
      ],
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('OCR Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process receipt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

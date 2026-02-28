import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { text, targetGoal = 'conversion' } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { text: aiResponse } = await generateText({
      model: openai('gpt-4o'),
      temperature: 0.1,
      system: `You are a linguist and high-end marketing strategist. Analyze the provided copy for emotional resonance, linguistic depth, and marketing effectiveness.
      Return ONLY valid JSON with this EXACT structure:
      {
        "wordAnalysis": [
          {
            "word": "word",
            "sentiment": 0.5, // -1 to 1
            "richness": "high/medium/low",
            "polysemy": ["meaning 1", "meaning 2"],
            "issue": "linguistic trap or weakness",
            "suggestion": "better alternative",
            "reasoning": "why this word works or fails in a marketing context"
          }
        ],
        "overallMetrics": {
          "conversionScore": 75,
          "emotionalTone": "Bold",
          "urgencyLevel": "High",
          "clarityScore": 85,
          "linguisticDensity": "Rich"
        },
        "recommendations": [
          {
            "type": "high",
            "title": "Actionable insight",
            "impact": "+15% conversion",
            "detail": "deep explanation",
            "before": "phrase",
            "after": "improved phrase"
          }
        ],
        "optimizedVersions": [
          {
            "title": "Goal-Focused Rewrite",
            "text": "The full rewritten copy",
            "score": 90,
            "changes": ["summary of major improvements"]
          }
        ]
      }`,
      prompt: `Target Goal: ${targetGoal}\n\nCopy to analyze: "${text}"\n\nCRITICAL: 
      - Be surgical and precise. 
      - Analyze how words interact (polysemy is key). 
      - If a word is plain, suggest a "richer" alternative.
      - Optimized versions must strictly adhere to the Target Goal: ${targetGoal}.`,
    });

    // Clean up response if it contains markdown markers
    let content = aiResponse.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```json\s*/, '').replace(/```$/, '');
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, content);
      return NextResponse.json({
        error: 'Invalid JSON from AI',
        raw: content.substring(0, 100)
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      message: (error as Error).message
    }, { status: 500 });
  }
}

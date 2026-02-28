import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetGoal = 'conversion' } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `You are a linguist and high-end marketing strategist. Analyze the provided copy for emotional resonance, linguistic depth, and marketing effectiveness.

Target Goal: ${targetGoal}

Copy to analyze: "${text.replace(/"/g, '\\"')}"

Return ONLY valid JSON with this EXACT structure:
{
  "wordAnalysis": [
    {
      "word": "word",
      "sentiment": 0.5, // -1 to 1
      "richness": "high/medium/low", // marketing power/evocative density
      "polysemy": ["meaning 1", "meaning 2"], // potential interpretations
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
}

CRITICAL: 
- Be surgical and precise. 
- Analyze how words interact (polysemy is key). 
- If a word is plain, suggest a "richer" alternative.
- Optimized versions must strictly adhere to the Target Goal: ${targetGoal}.`
        }]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return NextResponse.json({ error: `API error: ${claudeResponse.status}` }, { status: 500 });
    }

    const data = await claudeResponse.json();
    let content = data.content[0].text;

    // Clean up response
    content = content.trim();
    content = content.replace(/```json\s*/g, '');
    content = content.replace(/```\s*/g, '');

    const firstBrace = content.indexOf('{');
    if (firstBrace > 0) {
      content = content.substring(firstBrace);
    }

    const lastBrace = content.lastIndexOf('}');
    if (lastBrace > -1 && lastBrace < content.length - 1) {
      content = content.substring(0, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Try to repair
      content = content
        .replace(/[\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/,(\s*[}\]])/g, '$1');

      try {
        parsed = JSON.parse(content);
      } catch (secondError) {
        return NextResponse.json({
          error: 'Invalid JSON from AI',
          details: (parseError as Error).message
        }, { status: 500 });
      }
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      message: (error as Error).message
    }, { status: 500 });
  }
}

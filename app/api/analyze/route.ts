import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

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
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `You are a conversion copywriting expert. Analyze this marketing copy and return ONLY valid JSON with NO markdown formatting, NO code blocks, NO explanations - just pure JSON.

Copy to analyze: "${text.replace(/"/g, '\\"')}"

Return this EXACT structure with valid JSON:
{
  "wordAnalysis": [
    {"word": "word1", "sentiment": 0.5, "issue": null, "suggestion": null, "reasoning": "Brief reason"}
  ],
  "overallMetrics": {
    "conversionScore": 70,
    "emotionalTone": "neutral",
    "urgencyLevel": "medium",
    "clarityScore": 75,
    "confidenceLevel": "moderate"
  },
  "recommendations": [
    {
      "type": "high",
      "title": "Short title",
      "impact": "+20%",
      "detail": "Brief explanation without quotes",
      "before": "original text",
      "after": "improved text"
    }
  ],
  "optimizedVersions": [
    {
      "title": "Version Name",
      "text": "Rewritten copy here",
      "score": 85,
      "changes": ["change 1", "change 2"]
    }
  ],
  "competitorInsights": {
    "commonPatterns": ["pattern 1", "pattern 2"],
    "differentiationOpportunities": ["opportunity 1", "opportunity 2"]
  }
}

CRITICAL: Ensure all text values are properly escaped. No unescaped quotes, no newlines in strings. Keep explanations brief and simple.`
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

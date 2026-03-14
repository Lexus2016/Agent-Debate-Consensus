import { NextRequest, NextResponse } from "next/server";

function getApiKey(req: NextRequest): string | null {
  const serverKey = process.env.OPENROUTER_API_KEY;
  if (serverKey) return serverKey;
  return req.headers.get("x-api-key");
}

export async function GET(req: NextRequest) {
  const apiKey = getApiKey(req);

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key provided" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://lryq.com",
        "X-Title": "Agent Debate Consensus",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models from OpenRouter" },
      { status: 500 }
    );
  }
}

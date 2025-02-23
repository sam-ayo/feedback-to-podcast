
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Call {
  id: number;
  platform: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  insights: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { calls } = await req.json()

    if (!calls || !Array.isArray(calls)) {
      throw new Error('Calls array is required')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Create a summary of all calls for this week
    const weeklySummary = calls.map(call => {
      return `Meeting: ${call.title}
Date: ${new Date(call.date).toLocaleDateString()}
Platform: ${call.platform}
Duration: ${call.duration}
Key Insights:
${call.insights.map(insight => `- ${insight}`).join('\n')}
`
    }).join('\n\n')

    // Generate a conversational podcast script
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are writing a podcast script for a 30-minute show discussing the week's meetings. 
          Create a natural conversation between two hosts (Alex and Sarah) summarizing the key points and insights.
          Format as a structured dialogue with clear speaker indicators.
          Start with a brief intro and end with a conclusion.`
        },
        {
          role: "user",
          content: `Create a podcast script based on these meeting summaries:\n\n${weeklySummary}`
        }
      ]
    })

    const script = response.choices[0].message.content

    // Structure the script for text-to-speech processing
    const structuredScript = script.split('\n').reduce((acc, line) => {
      if (line.startsWith('Alex:')) {
        acc.push({ host_id: 'pNInz6obpgDQGcFmaJgB', text: line.replace('Alex:', '').trim() })
      } else if (line.startsWith('Sarah:')) {
        acc.push({ host_id: 'EXAVITQu4vr4xnSDxMaL', text: line.replace('Sarah:', '').trim() })
      }
      return acc
    }, [] as { host_id: string, text: string }[])

    return new Response(
      JSON.stringify({ script, structuredScript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-podcast-script:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

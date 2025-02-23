
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { calls } = await req.json()
    console.log('Processing calls:', JSON.stringify(calls))

    if (!calls || !Array.isArray(calls) || calls.length === 0) {
      throw new Error('Valid calls data is required')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Create a simple summary for OpenAI
    const summary = calls.map(call => 
      `Meeting: ${call.title}
      Platform: ${call.platform}
      Duration: ${call.duration}
      Key Points:
      ${call.insights.map(insight => `- ${insight}`).join('\n')}`
    ).join('\n\n')

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a meeting summarizer. Create a concise podcast-style summary of these meetings."
        },
        {
          role: "user",
          content: summary
        }
      ]
    })

    const script = response.choices[0].message.content
    console.log('Generated script:', script)

    return new Response(
      JSON.stringify({ script }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-podcast-script:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})


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
    console.log('Received calls:', JSON.stringify(calls))

    if (!calls || !Array.isArray(calls)) {
      throw new Error('Invalid calls data')
    }

    // Create a simpler summary for each call
    const summaries = calls.map(call => `
${call.title} (${call.platform}, ${call.duration})
Key Points:
${call.insights.join('\n')}
`).join('\n\n')

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Generate a simpler script
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Create a brief, clear summary of the following meetings."
        },
        {
          role: "user",
          content: summaries
        }
      ]
    })

    const script = response.choices[0].message.content
    console.log('Generated script:', script)

    return new Response(
      JSON.stringify({ 
        script,
        structuredScript: null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

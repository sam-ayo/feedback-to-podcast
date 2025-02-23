
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { calls } = await req.json()

    if (!calls || !Array.isArray(calls) || calls.length === 0) {
      throw new Error('Valid calls array is required')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Format meetings for the prompt
    const meetingsContext = calls.map(call => `
Meeting: ${call.title}
Date: ${new Date(call.date).toLocaleDateString()}
Platform: ${call.platform}
Duration: ${call.duration}
Key Points:
${call.insights.map(insight => `- ${insight}`).join('\n')}
    `).join('\n\n')

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are writing a podcast script for a weekly meeting summary. Create a natural conversation between two hosts (Alex and Sarah) discussing the key points and insights from the meetings. Keep it concise, professional, and engaging."
        },
        {
          role: "user",
          content: `Create a podcast script summarizing these meetings:\n${meetingsContext}`
        }
      ]
    })

    const script = response.choices[0].message.content

    console.log('Generated script successfully:', script.substring(0, 100) + '...')

    return new Response(
      JSON.stringify({ 
        script,
        structuredScript: [] // Empty array as we're using a single voice
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
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

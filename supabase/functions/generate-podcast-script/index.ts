
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
    const { feedback } = await req.json()

    if (!feedback) {
      throw new Error('Feedback is required')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a podcast script writer. Create an engaging discussion between two hosts (Alex and Sarah) 
          who analyze and discuss meeting feedback. Make it natural, conversational, and include some back-and-forth 
          dialogue. Format should be clean without markdown. Each line should start with the speaker's name followed 
          by a colon. Keep the tone professional but friendly.`
        },
        {
          role: "user",
          content: `Create a podcast script discussing this meeting feedback: ${feedback}`
        }
      ],
    })

    const script = response.choices[0].message.content

    return new Response(
      JSON.stringify({ script }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-podcast-script function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

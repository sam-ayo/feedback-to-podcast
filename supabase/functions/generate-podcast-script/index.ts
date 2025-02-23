
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "https://deno.land/x/zod/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}



const PodcastScriptLine = z.object({
  host_id: z.number(),
  text: z.string()
})

const PodcastScript = z.object({
  script: z.array(PodcastScriptLine)
})


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

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a podcast script writer. Create a discussion between two hosts about the given meeting feedback. 
          Make the dialogue natural and engaging, with both hosts contributing equally to the discussion.`
        },
        {
          role: "user",
          content: `Create a podcast script discussing this meeting feedback: ${feedback}`
        }
      ],
      response_format: zodResponseFormat(PodcastScript, "podcast")
    })

    const structuredScript = response.choices[0].message.parsed;

    return new Response(
      JSON.stringify({ structuredScript }),
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

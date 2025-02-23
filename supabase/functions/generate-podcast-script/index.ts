
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the structure for our dialogue segments
interface DialogueSegment {
  host_id: "pNInz6obpgDQGcFmaJgB" | "EXAVITQu4vr4xnSDxMaL"
  text: string
}

interface DialogueScript {
  segments: DialogueSegment[]
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
          content: `You are a podcast script writer. Create a discussion between two hosts about the given meeting feedback. 
          Structure the output as an array of dialogue segments, where each segment contains:
          - host_id: "pNInz6obpgDQGcFmaJgB" for Alex (male host) or "EXAVITQu4vr4xnSDxMaL" for Sarah (female host)
          - text: The spoken dialogue for that segment

          Make the dialogue natural and engaging, with both hosts contributing equally to the discussion.
          Format your response as valid JSON matching this structure:
          {
            "segments": [
              {
                "host_id": "pNInz6obpgDQGcFmaJgB",
                "text": "Hello and welcome..."
              },
              {
                "host_id": "EXAVITQu4vr4xnSDxMaL",
                "text": "Thanks Alex..."
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Create a podcast script discussing this meeting feedback: ${feedback}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const structuredScript = JSON.parse(response.choices[0].message.content) as DialogueScript

    // Return both the structured script and a formatted version for display
    const formattedScript = structuredScript.segments
      .map(segment => {
        const hostName = segment.host_id === "pNInz6obpgDQGcFmaJgB" ? "Alex" : "Sarah"
        return `${hostName}: ${segment.text}`
      })
      .join('\n')

    return new Response(
      JSON.stringify({ 
        script: formattedScript,
        structuredScript: structuredScript
      }),
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
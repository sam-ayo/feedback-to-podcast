
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
    const { text } = await req.json()
    console.log('Received text length:', text?.length)

    if (!text) {
      throw new Error('Text is required')
    }

    // Limit text length to prevent memory issues
    const truncatedText = text.slice(0, 4000)
    console.log('Processing text:', truncatedText)

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: truncatedText
    })

    const arrayBuffer = await mp3Response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const base64Audio = btoa(String.fromCharCode.apply(null, uint8Array))
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`

    console.log('Successfully generated audio')

    return new Response(
      JSON.stringify({ audioUrl }),
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

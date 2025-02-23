
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

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Received text length:', text.length)

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Split long text into chunks of 4000 characters
    const chunks = text.match(/.{1,4000}(?=\s|$)/g) || [text]
    const audioChunks: ArrayBuffer[] = []

    console.log('Processing text in', chunks.length, 'chunks')

    // Process each chunk
    for (const chunk of chunks) {
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "echo",
        input: chunk
      })

      const audioBuffer = await mp3Response.arrayBuffer()
      audioChunks.push(audioBuffer)
    }

    // Combine all audio chunks
    const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0)
    const combinedAudio = new Uint8Array(totalLength)
    let offset = 0

    for (const chunk of audioChunks) {
      combinedAudio.set(new Uint8Array(chunk), offset)
      offset += chunk.byteLength
    }

    // Convert to base64
    const base64Audio = btoa(String.fromCharCode(...combinedAudio))
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`

    console.log('Successfully generated audio')

    return new Response(
      JSON.stringify({ audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in text-to-speech:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

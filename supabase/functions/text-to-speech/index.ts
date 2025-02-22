
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { Voice, VoiceSettings } from "https://esm.sh/@elevenlabs/api@1.0.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Voice IDs for different hosts
const VOICE_IDS = {
  Alex: "pNInz6obpgDQGcFmaJgB", // Adam voice
  Sarah: "EXAVITQu4vr4xnSDxMaL"  // Sarah voice
}

const voiceSettings: VoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.75
}

async function generateSpeech(text: string, voiceId: string, apiKey: string): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: voiceSettings
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to generate speech: ${errorData}`)
  }

  return response.arrayBuffer()
}

async function concatenateAudioBuffers(buffers: ArrayBuffer[]): Promise<ArrayBuffer> {
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset)
    offset += buffer.byteLength
  }

  return result.buffer
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

    console.log('Starting text-to-speech conversion...')
    
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured')
    }

    // Split the script into lines and group by speaker
    const lines = text.split('\n').filter(line => line.trim())
    const audioBuffers: ArrayBuffer[] = []

    for (const line of lines) {
      const [speaker, ...textParts] = line.split(':')
      const speakerName = speaker.trim()
      const lineText = textParts.join(':').trim()

      if (lineText && VOICE_IDS[speakerName]) {
        const audioBuffer = await generateSpeech(lineText, VOICE_IDS[speakerName], apiKey)
        audioBuffers.push(audioBuffer)
      }
    }

    // Combine all audio segments
    const finalBuffer = await concatenateAudioBuffers(audioBuffers)
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(finalBuffer)))

    console.log('Successfully generated and combined all audio segments')

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'No additional details available'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Host configurations with their voice settings
interface Host {
  voiceId: string
  name: string
  description: string
  settings: {
    stability: number
    similarity_boost: number
  }
}

const HOSTS: Record<string, Host> = {
  Alex: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam voice
    name: "Alex",
    description: "Professional and engaging male host with a warm tone",
    settings: {
      stability: 0.75,
      similarity_boost: 0.75
    }
  },
  Sarah: {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
    name: "Sarah",
    description: "Friendly and articulate female host with a natural conversational style",
    settings: {
      stability: 0.75,
      similarity_boost: 0.75
    }
  }
}

async function generateSpeech(text: string, host: Host, apiKey: string): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${host.voiceId}/stream`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: host.settings
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to generate speech for ${host.name}: ${errorData}`)
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

async function uploadAudioToStorage(audioBuffer: ArrayBuffer, supabase: any): Promise<string> {
  const filename = `podcast_${new Date().getTime()}.mp3`
  const { data, error } = await supabase.storage
    .from('podcast_audio')
    .upload(filename, audioBuffer, {
      contentType: 'audio/mpeg',
      cacheControl: '3600'
    })

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from('podcast_audio')
    .getPublicUrl(filename)

  return publicUrl.publicUrl
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured')
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Split the script into lines and group by speaker
    const lines = text.split('\n').filter(line => line.trim())
    const audioBuffers: ArrayBuffer[] = []

    for (const line of lines) {
      const [speaker, ...textParts] = line.split(':')
      const speakerName = speaker.trim()
      const lineText = textParts.join(':').trim()

      const host = HOSTS[speakerName]
      if (lineText && host) {
        console.log(`Generating speech for ${host.name}: ${lineText.substring(0, 50)}...`)
        const audioBuffer = await generateSpeech(lineText, host, apiKey)
        audioBuffers.push(audioBuffer)
      }
    }

    // Combine all audio segments
    const finalBuffer = await concatenateAudioBuffers(audioBuffers)
    
    // Upload to Supabase Storage
    const audioUrl = await uploadAudioToStorage(finalBuffer, supabase)
    console.log('Audio file uploaded successfully:', audioUrl)

    return new Response(
      JSON.stringify({ audioUrl }),
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

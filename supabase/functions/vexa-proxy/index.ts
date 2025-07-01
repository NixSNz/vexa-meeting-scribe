
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Vexa API endpoints
const VEXA_API_BASE = 'http://89.47.113.63:18056'
const VEXA_BOT_MANAGER = 'http://89.47.113.63:18085'
const VEXA_TRANSCRIPTION_COLLECTOR = 'http://89.47.113.63:18123'
const VEXA_ADMIN_API = 'http://89.47.113.63:18057'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const { action, service } = await req.json()
    
    console.log('Vexa Proxy Request:', { action, service })

    let targetUrl = ''
    let endpoint = ''

    // Route to appropriate service
    switch (service) {
      case 'gateway':
        targetUrl = VEXA_API_BASE
        break
      case 'bot-manager':
        targetUrl = VEXA_BOT_MANAGER
        break
      case 'transcription-collector':
        targetUrl = VEXA_TRANSCRIPTION_COLLECTOR
        break
      case 'admin-api':
        targetUrl = VEXA_ADMIN_API
        break
      default:
        targetUrl = VEXA_API_BASE
    }

    // Define endpoints based on action
    switch (action) {
      case 'health':
        endpoint = '/health'
        break
      case 'bot-status':
        endpoint = '/bot/status'
        break
      case 'bot-invite':
        endpoint = '/bot/invite'
        break
      case 'transcripts':
        endpoint = '/transcripts'
        break
      case 'user-stats':
        endpoint = '/user/stats'
        break
      default:
        endpoint = '/health'
    }

    const proxyUrl = `${targetUrl}${endpoint}`
    console.log('Proxying to:', proxyUrl)

    // Make request to Vexa API
    const response = await fetch(proxyUrl, {
      method: action === 'bot-invite' ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add body for POST requests
      ...(action === 'bot-invite' && req.method === 'POST' ? {
        body: JSON.stringify(await req.json())
      } : {})
    })

    const data = await response.text()
    console.log('Vexa API Response:', response.status, data.slice(0, 200))

    // Return response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Vexa Proxy Error:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})

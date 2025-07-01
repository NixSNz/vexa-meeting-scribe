
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

    // Define endpoints based on action - trying different possible paths
    switch (action) {
      case 'health':
        // Try multiple possible health check endpoints
        const healthEndpoints = ['/', '/health', '/status', '/ping', '/api/health'];
        for (const healthEndpoint of healthEndpoints) {
          try {
            const testUrl = `${targetUrl}${healthEndpoint}`;
            console.log('Trying health endpoint:', testUrl);
            const testResponse = await fetch(testUrl, { 
              method: 'GET',
              timeout: 5000 
            });
            if (testResponse.ok) {
              endpoint = healthEndpoint;
              break;
            }
          } catch (e) {
            console.log(`Failed ${healthEndpoint}:`, e.message);
            continue;
          }
        }
        if (!endpoint) endpoint = '/'; // fallback
        break
      case 'bot-status':
        // Try multiple possible bot status endpoints
        const statusEndpoints = ['/bot/status', '/status', '/bot', '/api/bot/status'];
        for (const statusEndpoint of statusEndpoints) {
          try {
            const testUrl = `${targetUrl}${statusEndpoint}`;
            console.log('Trying status endpoint:', testUrl);
            const testResponse = await fetch(testUrl, { 
              method: 'GET',
              timeout: 5000 
            });
            if (testResponse.ok) {
              endpoint = statusEndpoint;
              break;
            }
          } catch (e) {
            console.log(`Failed ${statusEndpoint}:`, e.message);
            continue;
          }
        }
        if (!endpoint) endpoint = '/bot/status'; // fallback
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
        endpoint = '/'
    }

    const proxyUrl = `${targetUrl}${endpoint}`
    console.log('Final proxy URL:', proxyUrl)

    // Make request to Vexa API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(proxyUrl, {
        method: action === 'bot-invite' ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Edge-Function/1.0'
        },
        signal: controller.signal,
        // Add body for POST requests
        ...(action === 'bot-invite' && req.method === 'POST' ? {
          body: JSON.stringify(await req.json())
        } : {})
      });

      clearTimeout(timeoutId);

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log('Vexa API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: typeof responseData === 'string' ? responseData.slice(0, 200) : responseData
      });

      // If we got a 404, try to provide more helpful info
      if (response.status === 404) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Endpoint not found',
          details: `The endpoint ${endpoint} was not found on ${targetUrl}. The API may be down or the endpoint path may be incorrect.`,
          attempted_url: proxyUrl,
          service: service,
          action: action
        }), {
          status: 200, // Return 200 to frontend but indicate failure in body
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

      // For other errors, still return structured response
      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: `HTTP ${response.status}`,
          details: response.statusText,
          data: responseData,
          attempted_url: proxyUrl
        }), {
          status: 200, // Return 200 to frontend but indicate failure in body
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

      // Success case
      return new Response(JSON.stringify({
        success: true,
        data: responseData,
        status: response.status,
        attempted_url: proxyUrl
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout:', proxyUrl);
        return new Response(JSON.stringify({
          success: false,
          error: 'Request timeout',
          details: `Request to ${proxyUrl} timed out after 10 seconds`,
          attempted_url: proxyUrl
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
      
      throw fetchError; // Re-throw other fetch errors
    }

  } catch (error) {
    console.error('Vexa Proxy Error:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Proxy error', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Return 200 to avoid frontend fetch errors
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
})

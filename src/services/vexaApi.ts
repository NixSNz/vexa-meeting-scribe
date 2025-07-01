
// Integração com a API da Vexa.ai via Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

interface VexaApiConfig {
  apiKey?: string;
}

class VexaApiClient {
  private config: VexaApiConfig;

  constructor(config: VexaApiConfig = {}) {
    this.config = config;
  }

  private async makeProxyRequest(action: string, service: string = 'gateway', data?: any) {
    console.log('Vexa API Proxy Request:', { action, service, data });

    try {
      const { data: response, error } = await supabase.functions.invoke('vexa-proxy', {
        body: {
          action,
          service,
          ...data
        }
      });

      if (error) {
        console.error('Supabase Function Error:', error);
        throw new Error(`API Error: ${error.message}`);
      }

      console.log('Vexa API Proxy Response:', response);

      // Handle the new response format where success/failure is in the response body
      if (response && response.success === false) {
        throw new Error(response.details || response.error || 'Unknown API error');
      }

      return response;
    } catch (error) {
      console.error('Vexa API Proxy Error:', error);
      throw error;
    }
  }

  // Obter lista de transcrições (via Transcription Collector)
  async getTranscripts(page = 1, limit = 20) {
    return this.makeProxyRequest('transcripts', 'transcription-collector', { page, limit });
  }

  // Obter transcrição específica (via Transcription Collector)
  async getTranscript(transcriptId: string) {
    return this.makeProxyRequest('transcripts', 'transcription-collector', { transcriptId });
  }

  // Convidar bot para reunião (via Bot Manager)
  async inviteBot(meetingData: {
    meeting_url: string;
    title?: string;
    description?: string;
    scheduled_time?: string;
  }) {
    return this.makeProxyRequest('bot-invite', 'bot-manager', meetingData);
  }

  // Configurar participação automática (via Bot Manager)
  async setupAutoJoin(calendarData: {
    provider: 'google' | 'outlook';
    access_token: string;
    calendar_ids?: string[];
  }) {
    return this.makeProxyRequest('auto-join', 'bot-manager', calendarData);
  }

  // Obter status do bot (via Bot Manager)
  async getBotStatus() {
    return this.makeProxyRequest('bot-status', 'bot-manager');
  }

  // Cancelar convite do bot (via Bot Manager)
  async cancelBotInvite(meetingId: string) {
    return this.makeProxyRequest('cancel-invite', 'bot-manager', { meetingId });
  }

  // Buscar transcrições (via Transcription Collector)
  async searchTranscripts(query: string, filters?: {
    date_from?: string;
    date_to?: string;
    participants?: string[];
  }) {
    return this.makeProxyRequest('search-transcripts', 'transcription-collector', { 
      query, 
      filters 
    });
  }

  // Exportar transcrição (via Transcription Collector)
  async exportTranscript(transcriptId: string, format: 'txt' | 'json' | 'srt') {
    return this.makeProxyRequest('export-transcript', 'transcription-collector', {
      transcriptId,
      format
    });
  }

  // Obter estatísticas do usuário (via Admin API)
  async getUserStats() {
    return this.makeProxyRequest('user-stats', 'admin-api');
  }

  // Método para testar conectividade
  async testConnection() {
    try {
      const response = await this.makeProxyRequest('health', 'gateway');
      return { 
        success: true, 
        data: response,
        message: 'Conexão estabelecida com sucesso'
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Falha na conexão com a API da Vexa'
      };
    }
  }
}

// Instância singleton do cliente Vexa API
let vexaApiClient: VexaApiClient | null = null;

export const initVexaApi = (apiKey?: string) => {
  vexaApiClient = new VexaApiClient({ apiKey });
  return vexaApiClient;
};

export const getVexaApi = (): VexaApiClient => {
  if (!vexaApiClient) {
    vexaApiClient = new VexaApiClient();
  }
  return vexaApiClient;
};

export default VexaApiClient;


// Integração com a API da Vexa.ai hospedada na VPS
const VEXA_API_BASE = 'http://89.47.113.63:18056'; // Gateway principal
const VEXA_BOT_MANAGER = 'http://89.47.113.63:18085'; // Bot Manager
const VEXA_TRANSCRIPTION_COLLECTOR = 'http://89.47.113.63:18123'; // Transcription Collector
const VEXA_ADMIN_API = 'http://89.47.113.63:18057'; // Admin API

interface VexaApiConfig {
  apiKey?: string;
  baseUrl?: string;
}

class VexaApiClient {
  private config: VexaApiConfig;

  constructor(config: VexaApiConfig = {}) {
    this.config = {
      baseUrl: VEXA_API_BASE,
      ...config
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}, baseUrl?: string) {
    const url = `${baseUrl || this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...options.headers,
    };

    console.log('Vexa API Request:', { url, method: options.method || 'GET' });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('Vexa API Response:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Vexa API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Vexa API Error:', error);
      throw error;
    }
  }

  // Obter lista de transcrições (via Transcription Collector)
  async getTranscripts(page = 1, limit = 20) {
    return this.makeRequest(`/transcripts?page=${page}&limit=${limit}`, {}, VEXA_TRANSCRIPTION_COLLECTOR);
  }

  // Obter transcrição específica (via Transcription Collector)
  async getTranscript(transcriptId: string) {
    return this.makeRequest(`/transcripts/${transcriptId}`, {}, VEXA_TRANSCRIPTION_COLLECTOR);
  }

  // Convidar bot para reunião (via Bot Manager)
  async inviteBot(meetingData: {
    meeting_url: string;
    title?: string;
    description?: string;
    scheduled_time?: string;
  }) {
    return this.makeRequest('/bot/invite', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    }, VEXA_BOT_MANAGER);
  }

  // Configurar participação automática (via Bot Manager)
  async setupAutoJoin(calendarData: {
    provider: 'google' | 'outlook';
    access_token: string;
    calendar_ids?: string[];
  }) {
    return this.makeRequest('/bot/auto-join', {
      method: 'POST',
      body: JSON.stringify(calendarData),
    }, VEXA_BOT_MANAGER);
  }

  // Obter status do bot (via Bot Manager)
  async getBotStatus() {
    return this.makeRequest('/bot/status', {}, VEXA_BOT_MANAGER);
  }

  // Cancelar convite do bot (via Bot Manager)
  async cancelBotInvite(meetingId: string) {
    return this.makeRequest(`/bot/cancel/${meetingId}`, {
      method: 'DELETE',
    }, VEXA_BOT_MANAGER);
  }

  // Buscar transcrições (via Transcription Collector)
  async searchTranscripts(query: string, filters?: {
    date_from?: string;
    date_to?: string;
    participants?: string[];
  }) {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      if (filters.date_from) {
        params.append('date_from', filters.date_from);
      }
      if (filters.date_to) {
        params.append('date_to', filters.date_to);
      }
      if (filters.participants) {
        filters.participants.forEach(participant => {
          params.append('participants', participant);
        });
      }
    }
    
    return this.makeRequest(`/transcripts/search?${params}`, {}, VEXA_TRANSCRIPTION_COLLECTOR);
  }

  // Exportar transcrição (via Transcription Collector)
  async exportTranscript(transcriptId: string, format: 'txt' | 'json' | 'srt') {
    return this.makeRequest(`/transcripts/${transcriptId}/export?format=${format}`, {}, VEXA_TRANSCRIPTION_COLLECTOR);
  }

  // Obter estatísticas do usuário (via Admin API)
  async getUserStats() {
    return this.makeRequest('/user/stats', {}, VEXA_ADMIN_API);
  }

  // Método para testar conectividade
  async testConnection() {
    try {
      const response = await this.makeRequest('/health', {});
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
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
    // Inicializa sem API key por padrão
    vexaApiClient = new VexaApiClient();
  }
  return vexaApiClient;
};

export default VexaApiClient;

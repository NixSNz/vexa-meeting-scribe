
// Integração com a API da Vexa.ai
const VEXA_API_BASE = 'https://api.vexa.ai';

interface VexaApiConfig {
  apiKey: string;
  baseUrl?: string;
}

class VexaApiClient {
  private config: VexaApiConfig;

  constructor(config: VexaApiConfig) {
    this.config = {
      baseUrl: VEXA_API_BASE,
      ...config
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Vexa API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Obter lista de transcrições
  async getTranscripts(page = 1, limit = 20) {
    return this.makeRequest(`/transcripts?page=${page}&limit=${limit}`);
  }

  // Obter transcrição específica
  async getTranscript(transcriptId: string) {
    return this.makeRequest(`/transcripts/${transcriptId}`);
  }

  // Convidar bot para reunião
  async inviteBot(meetingData: {
    meeting_url: string;
    title?: string;
    description?: string;
    scheduled_time?: string;
  }) {
    return this.makeRequest('/bot/invite', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  // Configurar participação automática
  async setupAutoJoin(calendarData: {
    provider: 'google' | 'outlook';
    access_token: string;
    calendar_ids?: string[];
  }) {
    return this.makeRequest('/bot/auto-join', {
      method: 'POST',
      body: JSON.stringify(calendarData),
    });
  }

  // Obter status do bot
  async getBotStatus() {
    return this.makeRequest('/bot/status');
  }

  // Cancelar convite do bot
  async cancelBotInvite(meetingId: string) {
    return this.makeRequest(`/bot/cancel/${meetingId}`, {
      method: 'DELETE',
    });
  }

  // Buscar transcrições
  async searchTranscripts(query: string, filters?: {
    date_from?: string;
    date_to?: string;
    participants?: string[];
  }) {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.makeRequest(`/transcripts/search?${params}`);
  }

  // Exportar transcrição
  async exportTranscript(transcriptId: string, format: 'txt' | 'json' | 'srt') {
    return this.makeRequest(`/transcripts/${transcriptId}/export?format=${format}`);
  }

  // Obter estatísticas do usuário
  async getUserStats() {
    return this.makeRequest('/user/stats');
  }
}

// Instância singleton do cliente Vexa API
let vexaApiClient: VexaApiClient | null = null;

export const initVexaApi = (apiKey: string) => {
  vexaApiClient = new VexaApiClient({ apiKey });
  return vexaApiClient;
};

export const getVexaApi = (): VexaApiClient => {
  if (!vexaApiClient) {
    throw new Error('Vexa API não foi inicializada. Chame initVexaApi() primeiro.');
  }
  return vexaApiClient;
};

export default VexaApiClient;

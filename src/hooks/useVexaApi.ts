
import { useState, useEffect } from 'react';
import { getVexaApi } from '@/services/vexaApi';
import { useToast } from '@/hooks/use-toast';

export const useTranscripts = (page = 1, limit = 20) => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTranscripts();
  }, [page, limit]);

  const loadTranscripts = async () => {
    try {
      setLoading(true);
      setError(null);
      const vexaApi = getVexaApi();
      const data = await vexaApi.getTranscripts(page, limit);
      setTranscripts(data.transcripts || data || []);
    } catch (err) {
      console.error('Error loading transcripts from Vexa:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar transcrições da Vexa",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { transcripts, loading, error, refetch: loadTranscripts };
};

export const useTranscript = (transcriptId: string) => {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (transcriptId) {
      loadTranscript();
    }
  }, [transcriptId]);

  const loadTranscript = async () => {
    try {
      setLoading(true);
      setError(null);
      const vexaApi = getVexaApi();
      const data = await vexaApi.getTranscript(transcriptId);
      setTranscript(data);
    } catch (err) {
      console.error('Error loading transcript from Vexa:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar transcrição da Vexa",
        description: "Transcrição não encontrada ou inacessível.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { transcript, loading, error, refetch: loadTranscript };
};

export const useBotInvite = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const inviteBot = async (meetingData: {
    meeting_url: string;
    title?: string;
    description?: string;
    scheduled_time?: string;
  }) => {
    try {
      setLoading(true);
      const vexaApi = getVexaApi();
      const result = await vexaApi.inviteBot(meetingData);
      
      toast({
        title: "Bot convidado com sucesso!",
        description: "O bot participará da reunião e gerará a transcrição.",
      });
      
      return result;
    } catch (err) {
      console.error('Error inviting bot:', err);
      toast({
        title: "Erro ao convidar bot",
        description: err.message || "Erro na comunicação com a API da Vexa.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const vexaApi = getVexaApi();
      const result = await vexaApi.testConnection();
      
      if (result.success) {
        toast({
          title: "Conexão bem-sucedida!",
          description: "API da Vexa está funcionando corretamente.",
        });
      } else {
        toast({
          title: "Erro de conexão",
          description: result.error || "Não foi possível conectar com a API da Vexa.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error testing connection:', err);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível testar a conexão com a API da Vexa.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { inviteBot, testConnection, loading };
};

export const useAutoJoin = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const setupAutoJoin = async (calendarData: {
    provider: 'google' | 'outlook';
    access_token: string;
    calendar_ids?: string[];
  }) => {
    try {
      setLoading(true);
      const vexaApi = getVexaApi();
      const result = await vexaApi.setupAutoJoin(calendarData);
      
      toast({
        title: "Configuração salva!",
        description: "Participação automática ativada com sucesso.",
      });
      
      return result;
    } catch (err) {
      console.error('Error setting up auto-join:', err);
      toast({
        title: "Erro na configuração",
        description: err.message || "Erro na comunicação com a API da Vexa.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { setupAutoJoin, loading };
};

export const useBotStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBotStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const vexaApi = getVexaApi();
      const data = await vexaApi.getBotStatus();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching bot status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotStatus();
  }, []);

  return { status, loading, error, refetch: fetchBotStatus };
};

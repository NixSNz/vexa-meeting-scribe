
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
      const vexaApi = getVexaApi();
      const data = await vexaApi.getTranscripts(page, limit);
      setTranscripts(data.transcripts || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar transcrições",
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
      const vexaApi = getVexaApi();
      const data = await vexaApi.getTranscript(transcriptId);
      setTranscript(data);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar transcrição",
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
      toast({
        title: "Erro ao convidar bot",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { inviteBot, loading };
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
      toast({
        title: "Erro na configuração",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { setupAutoJoin, loading };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { getVexaApi } from '@/services/vexaApi';

export interface Transcription {
  id: string;
  title: string;
  meeting_url: string;
  description?: string;
  transcript_content?: string;
  status: string;
  participants_count?: number;
  duration_minutes?: number;
  scheduled_time?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  vexa_transcript_id?: string;
}

export const useTranscriptions = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTranscriptions = async () => {
    if (!user) return;
    
    try {
      // Busca transcrições do banco local
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranscriptions(data || []);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      toast({
        title: "Erro ao carregar transcrições",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTranscription = async (data: {
    title: string;
    meeting_url: string;
    description?: string;
    scheduled_time?: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Primeiro, cria a transcrição no banco local
      const { data: transcription, error: dbError } = await supabase
        .from('transcriptions')
        .insert({
          user_id: user.id,
          title: data.title,
          meeting_url: data.meeting_url,
          description: data.description,
          scheduled_time: data.scheduled_time,
          status: 'processing'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Integra com a API da Vexa para convidar o bot
      try {
        const vexaApi = getVexaApi();
        const vexaResponse = await vexaApi.inviteBot({
          meeting_url: data.meeting_url,
          title: data.title,
          description: data.description,
          scheduled_time: data.scheduled_time,
        });

        console.log('Vexa bot invite response:', vexaResponse);

        // Atualizar com o ID da Vexa se disponível
        if (vexaResponse.transcript_id || vexaResponse.id) {
          await supabase
            .from('transcriptions')
            .update({ 
              vexa_transcript_id: vexaResponse.transcript_id || vexaResponse.id,
              status: 'invited'
            })
            .eq('id', transcription.id);
        }

        toast({
          title: "Bot convidado com sucesso!",
          description: "O bot participará da reunião e gerará a transcrição automaticamente.",
        });

      } catch (vexaError) {
        console.error('Vexa API error:', vexaError);
        
        // Atualiza status para erro mas mantém o registro
        await supabase
          .from('transcriptions')
          .update({ status: 'error' })
          .eq('id', transcription.id);

        toast({
          title: "Transcrição salva, mas houve erro na integração",
          description: "A transcrição foi salva localmente, mas não foi possível conectar com o bot.",
          variant: "destructive",
        });
      }

      await fetchTranscriptions();
      return { data: transcription, error: null };

    } catch (error) {
      console.error('Error creating transcription:', error);
      toast({
        title: "Erro ao criar transcrição",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const syncWithVexa = async () => {
    if (!user) return;

    try {
      const vexaApi = getVexaApi();
      
      // Testa a conexão primeiro
      const connectionTest = await vexaApi.testConnection();
      if (!connectionTest.success) {
        console.error('Vexa API connection failed:', connectionTest.error);
        return;
      }

      // Busca transcrições da Vexa
      const vexaTranscripts = await vexaApi.getTranscripts();
      console.log('Vexa transcripts:', vexaTranscripts);

      // Aqui você pode implementar lógica para sincronizar
      // as transcrições da Vexa com o banco local
      
    } catch (error) {
      console.error('Error syncing with Vexa:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTranscriptions();
      // Sincroniza com Vexa após carregar transcrições locais
      syncWithVexa();
    }
  }, [user]);

  return {
    transcriptions,
    loading,
    createTranscription,
    fetchTranscriptions,
    syncWithVexa,
  };
};

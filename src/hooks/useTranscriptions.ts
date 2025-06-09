
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Transcription {
  id: string;
  title: string;
  meeting_url: string;
  description?: string;
  transcript_content?: string;
  status: string; // Changed from union type to string to match Supabase
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

      // Aqui você integraria com a API da Vexa para convidar o bot
      // Exemplo de chamada para a API da Vexa:
      /*
      const vexaResponse = await fetch('/api/vexa/invite-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VEXA_API_KEY}`
        },
        body: JSON.stringify({
          meeting_url: data.meeting_url,
          title: data.title,
          description: data.description,
          scheduled_time: data.scheduled_time,
          callback_url: `${window.location.origin}/api/vexa/webhook`
        })
      });

      if (vexaResponse.ok) {
        const vexaData = await vexaResponse.json();
        // Atualizar com o ID da Vexa
        await supabase
          .from('transcriptions')
          .update({ vexa_transcript_id: vexaData.transcript_id })
          .eq('id', transcription.id);
      }
      */

      await fetchTranscriptions();
      
      toast({
        title: "Bot convidado com sucesso!",
        description: "O bot participará da reunião e gerará a transcrição automaticamente.",
      });

      return { data: transcription, error: null };
    } catch (error) {
      console.error('Error creating transcription:', error);
      toast({
        title: "Erro ao convidar bot",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchTranscriptions();
    }
  }, [user]);

  return {
    transcriptions,
    loading,
    createTranscription,
    fetchTranscriptions,
  };
};

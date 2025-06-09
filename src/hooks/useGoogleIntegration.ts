
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface GoogleIntegration {
  id: string;
  google_email: string;
  auto_join_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useGoogleIntegration = () => {
  const [integration, setIntegration] = useState<GoogleIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIntegration = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('google_integrations')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      setIntegration(data);
    } catch (error) {
      console.error('Error fetching Google integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateIntegration = async (data: {
    google_email: string;
    auto_join_enabled: boolean;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data: result, error } = await supabase
        .from('google_integrations')
        .upsert({
          user_id: user.id,
          google_email: data.google_email,
          auto_join_enabled: data.auto_join_enabled,
        })
        .select()
        .single();

      if (error) throw error;

      setIntegration(result);
      
      toast({
        title: "Integração salva!",
        description: "Suas configurações do Google Calendar foram atualizadas.",
      });

      return { data: result, error: null };
    } catch (error) {
      console.error('Error saving Google integration:', error);
      toast({
        title: "Erro ao salvar integração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteIntegration = async () => {
    if (!user || !integration) return { error: 'No integration to delete' };

    try {
      const { error } = await supabase
        .from('google_integrations')
        .delete()
        .eq('id', integration.id);

      if (error) throw error;

      setIntegration(null);
      
      toast({
        title: "Integração removida",
        description: "A integração com Google Calendar foi desconectada.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting Google integration:', error);
      toast({
        title: "Erro ao remover integração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchIntegration();
    }
  }, [user]);

  return {
    integration,
    loading,
    createOrUpdateIntegration,
    deleteIntegration,
    fetchIntegration,
  };
};

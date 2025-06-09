
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, Link, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranscriptions } from '@/hooks/useTranscriptions';

const InviteBot = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createTranscription } = useTranscriptions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    meetingLink: '',
    title: '',
    description: '',
    scheduledTime: ''
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleInviteBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    const { error } = await createTranscription({
      title: formData.title,
      meeting_url: formData.meetingLink,
      description: formData.description,
      scheduled_time: formData.scheduledTime || undefined,
    });

    if (!error) {
      navigate('/');
    }

    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Convidar Bot para Reunião</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Convidar Bot Vexa</CardTitle>
                <CardDescription>
                  Cole o link da reunião e o bot participará automaticamente para gerar a transcrição
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleInviteBot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Link da Reunião *</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Suportamos Google Meet, Zoom, Microsoft Teams e outras plataformas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título da Reunião *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Reunião de Planejamento Q4"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione uma descrição para contextualizar a reunião..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Data e Hora Agendada (Opcional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• O bot entrará na reunião automaticamente no horário agendado</li>
                  <li>• A transcrição será processada em tempo real</li>
                  <li>• Você receberá uma notificação quando estiver pronta</li>
                  <li>• A transcrição aparecerá no seu dashboard</li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.meetingLink || !formData.title}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  {loading ? 'Convidando...' : 'Convidar Bot'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InviteBot;


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, Calendar, Download, Search, Play, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranscriptions } from '@/hooks/useTranscriptions';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { transcriptions, loading: transcriptionsLoading } = useTranscriptions();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedTranscriptions = transcriptions.filter(t => t.status === 'completed');
  const processingTranscriptions = transcriptions.filter(t => t.status === 'processing');
  const totalParticipants = transcriptions.reduce((sum, t) => sum + (t.participants_count || 0), 0);
  const totalDuration = transcriptions.reduce((sum, t) => sum + (t.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Vexa Transcriptions</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600">Olá, {user.email}</span>
              <Button 
                variant="outline" 
                onClick={() => navigate('/invite-bot')}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Convidar Bot</span>
              </Button>
              <Button 
                onClick={() => navigate('/settings')}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                Configurações
              </Button>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Reuniões</p>
                  <p className="text-2xl font-bold text-slate-900">{transcriptions.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Horas Transcritas</p>
                  <p className="text-2xl font-bold text-slate-900">{(totalDuration / 60).toFixed(1)}h</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Concluídas</p>
                  <p className="text-2xl font-bold text-slate-900">{completedTranscriptions.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Participantes</p>
                  <p className="text-2xl font-bold text-slate-900">{totalParticipants}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar transcrições..."
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
            Filtros
          </Button>
        </div>

        {/* Loading State */}
        {transcriptionsLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando transcrições...</p>
          </div>
        )}

        {/* Empty State */}
        {!transcriptionsLoading && transcriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Mic className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma transcrição ainda</h3>
            <p className="text-slate-600 mb-4">Comece convidando um bot para sua primeira reunião.</p>
            <Button 
              onClick={() => navigate('/invite-bot')}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              Convidar Bot
            </Button>
          </div>
        )}

        {/* Meetings Grid */}
        {!transcriptionsLoading && transcriptions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {transcriptions.map((transcription) => (
              <Card 
                key={transcription.id} 
                className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => transcription.status === 'completed' && navigate(`/transcript/${transcription.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 group-hover:text-violet-600 transition-colors">
                        {transcription.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        {new Date(transcription.created_at).toLocaleDateString('pt-BR')} • 
                        {transcription.duration_minutes ? ` ${transcription.duration_minutes}min` : ' Processando...'}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={transcription.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        transcription.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transcription.status === 'processing' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {transcription.status === 'completed' ? 'Concluída' : 
                       transcription.status === 'processing' ? 'Processando' : 'Erro'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {transcription.description || transcription.transcript_content?.substring(0, 150) || 'Aguardando transcrição...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>{transcription.participants_count || 0} participantes</span>
                    </div>
                    
                    {transcription.status === 'completed' && (
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!transcriptionsLoading && transcriptions.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
              Carregar mais reuniões
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

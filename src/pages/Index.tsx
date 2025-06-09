
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, Calendar, Download, Search, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Mock data para demonstração
  const mockMeetings = [
    {
      id: 1,
      title: "Reunião de Planejamento Q4",
      date: "2024-06-08",
      time: "14:30",
      duration: "45min",
      participants: 5,
      status: "completed",
      snippet: "Discutimos as metas para o último trimestre e definimos as prioridades..."
    },
    {
      id: 2,
      title: "Daily Standup - Equipe Dev",
      date: "2024-06-08",
      time: "09:00",
      duration: "15min",
      participants: 8,
      status: "completed",
      snippet: "João atualizou sobre o progresso do novo sistema de autenticação..."
    },
    {
      id: 3,
      title: "Apresentação para Cliente",
      date: "2024-06-07",
      time: "16:00",
      duration: "60min",
      participants: 12,
      status: "processing",
      snippet: "Transcrição sendo processada..."
    }
  ];

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
                  <p className="text-2xl font-bold text-slate-900">24</p>
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
                  <p className="text-2xl font-bold text-slate-900">18.5h</p>
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
                  <p className="text-sm font-medium text-slate-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-slate-900">7</p>
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
                  <p className="text-2xl font-bold text-slate-900">156</p>
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

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockMeetings.map((meeting) => (
            <Card key={meeting.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 group-hover:text-violet-600 transition-colors">
                      {meeting.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      {meeting.date} • {meeting.time} • {meeting.duration}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={meeting.status === 'completed' ? 'default' : 'secondary'}
                    className={meeting.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {meeting.status === 'completed' ? 'Concluída' : 'Processando'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {meeting.snippet}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    <span>{meeting.participants} participantes</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
            Carregar mais reuniões
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;

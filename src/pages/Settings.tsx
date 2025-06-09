
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Mail, Calendar, Key, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'João Silva',
      email: 'joao@empresa.com'
    },
    google: {
      email: '',
      autoJoin: false
    },
    notifications: {
      emailNotifications: true,
      transcriptionReady: true,
      weeklyReport: false
    }
  });

  const handleGoogleIntegration = async () => {
    setLoading(true);
    try {
      // Aqui seria a integração com Google Calendar API
      // Redirecionamento para OAuth do Google
      window.location.href = '/api/auth/google/calendar';
    } catch (error) {
      toast({
        title: "Erro na integração",
        description: "Não foi possível conectar com o Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Salvar configurações via API
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: "Configurações salvas!",
          description: "Suas preferências foram atualizadas com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-xl font-bold text-slate-900">Configurações</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Informações do Perfil</CardTitle>
                    <CardDescription>
                      Gerencie suas informações pessoais
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Google Calendar</CardTitle>
                    <CardDescription>
                      Conecte sua conta do Google para participação automática em reuniões
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleEmail">Email do Google</Label>
                  <Input
                    id="googleEmail"
                    type="email"
                    placeholder="seu-email@gmail.com"
                    value={settings.google.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      google: { ...settings.google, email: e.target.value }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="autoJoin">Participação Automática</Label>
                    <p className="text-sm text-slate-500">
                      O bot entrará automaticamente em todas as suas reuniões
                    </p>
                  </div>
                  <Switch
                    id="autoJoin"
                    checked={settings.google.autoJoin}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      google: { ...settings.google, autoJoin: checked }
                    })}
                  />
                </div>

                <Button 
                  onClick={handleGoogleIntegration}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {loading ? 'Conectando...' : 'Conectar Google Calendar'}
                </Button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Monitora seu calendário em busca de reuniões</li>
                    <li>• Convida automaticamente o bot para reuniões agendadas</li>
                    <li>• Gera transcrições de todas as reuniões</li>
                    <li>• Respeita configurações de privacidade</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>
                      Configure como deseja receber atualizações
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-sm text-slate-500">
                      Receba emails sobre atividades importantes
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="transcriptionReady">Transcrição Pronta</Label>
                    <p className="text-sm text-slate-500">
                      Notificar quando uma transcrição estiver disponível
                    </p>
                  </div>
                  <Switch
                    id="transcriptionReady"
                    checked={settings.notifications.transcriptionReady}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, transcriptionReady: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="weeklyReport">Relatório Semanal</Label>
                    <p className="text-sm text-slate-500">
                      Resumo semanal das suas transcrições e atividades
                    </p>
                  </div>
                  <Switch
                    id="weeklyReport"
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReport: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;

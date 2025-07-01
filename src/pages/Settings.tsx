
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Calendar, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleIntegration } from '@/hooks/useGoogleIntegration';
import VexaConnectionTest from '@/components/VexaConnectionTest';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { integration, loading, createOrUpdateIntegration, deleteIntegration } = useGoogleIntegration();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    googleEmail: integration?.google_email || '',
    autoJoinEnabled: integration?.auto_join_enabled || false
  });

  React.useEffect(() => {
    if (integration) {
      setFormData({
        googleEmail: integration.google_email,
        autoJoinEnabled: integration.auto_join_enabled
      });
    }
  }, [integration]);

  const handleSaveGoogleIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createOrUpdateIntegration({
      google_email: formData.googleEmail,
      auto_join_enabled: formData.autoJoinEnabled
    });

    if (!result.error) {
      toast({
        title: "Configurações salvas!",
        description: "Integração com Google Calendar atualizada.",
      });
    }
  };

  const handleDeleteIntegration = async () => {
    const result = await deleteIntegration();
    if (!result.error) {
      setFormData({
        googleEmail: '',
        autoJoinEnabled: false
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    React.useEffect(() => {
      navigate('/auth');
    }, [navigate]);
    return null;
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
            <h1 className="text-xl font-bold text-slate-900">Configurações</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Teste de Conexão Vexa */}
        <VexaConnectionTest />

        {/* Google Calendar Integration */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Integração Google Calendar</CardTitle>
                <CardDescription>
                  Configure a participação automática em reuniões do Google Calendar
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSaveGoogleIntegration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleEmail">Email do Google Calendar</Label>
                <Input
                  id="googleEmail"
                  type="email"
                  placeholder="seu@gmail.com"
                  value={formData.googleEmail}
                  onChange={(e) => setFormData({ ...formData, googleEmail: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoJoin">Participação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar bot automaticamente em reuniões do calendário
                  </p>
                </div>
                <Switch
                  id="autoJoin"
                  checked={formData.autoJoinEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoJoinEnabled: checked })}
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={loading || !formData.googleEmail}
                  className="flex-1"
                >
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
                
                {integration && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDeleteIntegration}
                    disabled={loading}
                  >
                    Remover Integração
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Gerencie sua conta e preferências
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email da Conta</Label>
              <Input value={user.email || ''} disabled />
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full"
              >
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBotInvite, useBotStatus } from '@/hooks/useVexaApi';
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VexaConnectionTest = () => {
  const { testConnection, loading: testLoading } = useBotInvite();
  const { status: botStatus, loading: statusLoading, refetch: refetchStatus } = useBotStatus();
  const { toast } = useToast();
  const [connectionResults, setConnectionResults] = React.useState<any>(null);

  const handleTestConnection = async () => {
    console.log('Testing Vexa API connection...');
    
    try {
      const result = await testConnection();
      setConnectionResults(result);
      
      if (result.success) {
        toast({
          title: "Conexão bem-sucedida!",
          description: "API da Vexa está funcionando via proxy do Supabase.",
        });
      } else {
        toast({
          title: "Erro de conexão",
          description: `Falha: ${result.error}`,
          variant: "destructive",
        });
      }
      
      refetchStatus();
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionResults({ success: false, error: error.message });
      
      toast({
        title: "Erro no teste",
        description: "Falha ao testar conexão com a API da Vexa.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (success: boolean | null) => {
    if (success === null) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (success: boolean | null) => {
    if (success === null) return "Não testado";
    return success ? "Conectado" : "Falha na conexão";
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Status da API Vexa
            </CardTitle>
            <CardDescription>
              Teste de conectividade com a API da Vexa via Supabase Edge Functions
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={testLoading || statusLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${testLoading ? 'animate-spin' : ''}`} />
            Testar Conexão
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Endpoints da API Vexa:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Gateway Principal:</span>
                <Badge variant="outline">89.47.113.63:18056</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Bot Manager:</span>
                <Badge variant="outline">89.47.113.63:18085</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Transcription Collector:</span>
                <Badge variant="outline">89.47.113.63:18123</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Admin API:</span>
                <Badge variant="outline">89.47.113.63:18057</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Status de Conectividade:</h4>
            
            {/* Connection Test Results */}
            <div className="p-3 bg-slate-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(connectionResults?.success)}
                <span className="font-medium text-sm">
                  Teste de Conexão: {getStatusText(connectionResults?.success)}
                </span>
              </div>
              {connectionResults && (
                <div className="text-xs text-slate-600">
                  {connectionResults.success 
                    ? "Proxy do Supabase funcionando corretamente" 
                    : `Erro: ${connectionResults.error}`
                  }
                </div>
              )}
            </div>

            {/* Bot Status */}
            <div className="p-3 bg-slate-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                {statusLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                ) : botStatus ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="font-medium text-sm">
                  Status do Bot: {statusLoading ? "Verificando..." : botStatus ? "Ativo" : "Inativo"}
                </span>
              </div>
              {botStatus && (
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-20">
                  {JSON.stringify(botStatus, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Informações da Integração:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• VPS: Ubuntu 24.04 LTS com Docker (89.47.113.63)</li>
            <li>• Proxy: Supabase Edge Functions para resolver CORS</li>
            <li>• Serviços: Gateway, Bot Manager, Transcription Collector, Admin API</li>
            <li>• Whisper: 2 instâncias para transcrição de áudio</li>
            <li>• Status: {connectionResults?.success ? "✅ Conectado" : "❌ Desconectado"}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VexaConnectionTest;

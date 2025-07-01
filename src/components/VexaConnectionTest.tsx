
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBotInvite, useBotStatus } from '@/hooks/useVexaApi';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const VexaConnectionTest = () => {
  const { testConnection, loading: testLoading } = useBotInvite();
  const { status: botStatus, loading: statusLoading, refetch: refetchStatus } = useBotStatus();

  const handleTestConnection = async () => {
    await testConnection();
    refetchStatus();
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
              Verificação de conectividade com a API da Vexa
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
          <div className="space-y-2">
            <h4 className="font-medium">Endpoints da API:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Gateway Principal:</span>
                <Badge variant="outline">:18056</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Bot Manager:</span>
                <Badge variant="outline">:18085</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Transcription Collector:</span>
                <Badge variant="outline">:18123</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin API:</span>
                <Badge variant="outline">:18057</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Status do Bot:</h4>
            {statusLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verificando...</span>
              </div>
            ) : botStatus ? (
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span>Conectado</span>
                </div>
                <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(botStatus, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm">Desconectado</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Informações de Integração:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• IP da VPS: 89.47.113.63</li>
            <li>• Sistema: Ubuntu 24.04 LTS com Docker</li>
            <li>• Serviços: Gateway, Bot Manager, Transcription Collector, Admin API</li>
            <li>• Whisper: 2 instâncias para transcrição de áudio</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VexaConnectionTest;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Copy, Play, Pause, Calendar, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TranscriptViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranscript();
  }, [id]);

  const loadTranscript = async () => {
    try {
      // Integração com API da Vexa.ai
      const response = await fetch(`/api/vexa/transcripts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vexaToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTranscript(data);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar transcrição",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTranscript = (format) => {
    if (!transcript) return;

    let content, filename;
    
    if (format === 'txt') {
      content = transcript.text;
      filename = `transcricao-${transcript.id}.txt`;
    } else if (format === 'json') {
      content = JSON.stringify(transcript, null, 2);
      filename = `transcricao-${transcript.id}.json`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: `Arquivo ${filename} baixado com sucesso.`,
    });
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript.text);
    toast({
      title: "Texto copiado!",
      description: "Transcrição copiada para a área de transferência.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando transcrição...</p>
        </div>
      </div>
    );
  }

  // Mock data para demonstração
  const mockTranscript = {
    id: id,
    title: "Reunião de Planejamento Q4",
    date: "2024-06-08",
    time: "14:30",
    duration: "45min",
    participants: ["João Silva", "Maria Santos", "Pedro Costa", "Ana Paula", "Carlos Lima"],
    status: "completed",
    text: `João Silva [14:30]: Olá pessoal, vamos começar nossa reunião de planejamento para o Q4. Hoje temos alguns pontos importantes para discutir.

Maria Santos [14:31]: Oi João, obrigada por organizar. Estou ansiosa para definirmos as metas do próximo trimestre.

Pedro Costa [14:31]: Boa tarde! Preparei alguns dados de vendas que podem ser úteis para nossa discussão.

João Silva [14:32]: Perfeito Pedro. Antes de entrarmos nos dados, gostaria que cada um compartilhasse brevemente suas perspectivas sobre o trimestre passado.

Ana Paula [14:33]: Do ponto de vista de marketing, tivemos um crescimento de 15% no engajamento nas redes sociais. As campanhas de setembro foram especialmente eficazes.

Carlos Lima [14:34]: Na área técnica, conseguimos implementar as três principais funcionalidades que estavam no roadmap. A performance da aplicação melhorou 20%.

Maria Santos [14:35]: Excelente trabalho da equipe técnica, Carlos. Do lado financeiro, fechamos o trimestre 8% acima da meta de receita.

Pedro Costa [14:36]: Isso é fantástico! Vou apresentar agora os números detalhados. Tivemos um crescimento consistente mês a mês...

João Silva [14:40]: Com base nesses resultados positivos, acredito que podemos ser mais ambiciosos nas metas do Q4. O que vocês acham?

Ana Paula [14:41]: Concordo. Vejo potencial para expandirmos nossos esforços de marketing digital, especialmente em vídeo marketing.

Carlos Lima [14:42]: Do lado técnico, podemos acelerar o desenvolvimento das funcionalidades de IA que estão no backlog.

Maria Santos [14:43]: Financeiramente, podemos aumentar nossa meta de receita em 12% comparado ao trimestre atual.

Pedro Costa [14:44]: Os dados mostram uma tendência positiva. Acredito que conseguimos atingir essas metas mais altas.

João Silva [14:45]: Ótimo! Vamos então definir as prioridades específicas para cada área...

[Transcrição continua com mais detalhes da reunião]`
  };

  const currentTranscript = transcript || mockTranscript;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold text-slate-900">{currentTranscript.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadTranscript('txt')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>TXT</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadTranscript('json')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>JSON</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meeting Info */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentTranscript.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{currentTranscript.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentTranscript.time} • {currentTranscript.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{currentTranscript.participants.length} participantes</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Concluída
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentTranscript.participants.map((participant, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                  {participant}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transcript Content */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Transcrição</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-slate-50 rounded-lg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {currentTranscript.text}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TranscriptViewer;

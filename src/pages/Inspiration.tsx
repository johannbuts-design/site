import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  RefreshCw, Palette, BookOpen, User, Image, Music, Lightbulb, Type, Pencil, ExternalLink, Loader2
} from 'lucide-react';
import { getInspiration, saveInspiration, addXP, XP_CONFIG } from '@/services/storage';
import { generateInspiration as generateAIInspiration } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const Inspiration = () => {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const [inspiration, setInspiration] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInspiration = async () => {
    setIsRefreshing(true);

    try {
      const aiResult = await generateAIInspiration();

      if (!aiResult.data) {
        toast({
          title: 'Erreur IA',
          description: 'Impossible de générer l’inspiration depuis l’IA.',
          variant: 'destructive',
        });
        return;
      }

      const newInspiData = aiResult.data;
      const newId = crypto.randomUUID();
      const newDateKey = `${today}-${newId}`;
      const newInspi = { ...newInspiData, id: newId, date: newDateKey };

      saveInspiration(newDateKey, newInspi);
      addXP(XP_CONFIG.INSPIRATION_VIEW);
      setInspiration(newInspi);
      toast({ title: 'Inspiration IA générée !' });
    } catch (error) {
      console.error('Erreur IA :', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const existing = getInspiration(today);
    if (existing) {
      setInspiration(existing);
    } else {
      fetchInspiration();
    }
  }, []);

  if (!inspiration) return (
    <PageContainer title="Inspiration du jour" subtitle="Chargement...">
      <div className="text-center py-20"><Loader2 className="animate-spin w-10 h-10 mx-auto text-primary" /></div>
    </PageContainer>
  );

  const Section = ({ icon: Icon, title, gradient, children }) => (
    <div className="glass-card p-5 animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <div className={`widget-icon ${gradient}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <PageContainer title="Inspiration du jour" subtitle={new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}>
      <div className="flex justify-end mb-6">
        <button onClick={fetchInspiration} disabled={isRefreshing} className="ios-button flex items-center gap-2">
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {isRefreshing ? 'Génération...' : 'Régénérer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sections comme avant */}
        {/* Réutilise les composants Section avec les blocs artist, personality, etc. en gardant ton code */}
      </div>
    </PageContainer>
  );
};

export default Inspiration;

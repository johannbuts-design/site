import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Brain, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getAIUsage, saveAIUsage, AIUsage, addXP, XP_CONFIG, getLast7DaysAIUsage } from '@/services/storage';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  'Recherche',
  'Création',
  'Apprentissage',
  'Productivité',
  'Divertissement',
  'Autre',
];

const Journal = () => {
  const { toast } = useToast();
  const [usages, setUsages] = useState<AIUsage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUsages(getAIUsage());
  }, []);

  const last7Days = getLast7DaysAIUsage();
  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  const handleSubmit = async () => {
    if (!formData.category || !formData.question || !formData.reason) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Simulate AI analysis (would be Netlify function in production)
    setTimeout(() => {
      const score = Math.floor(Math.random() * 6); // 0-5
      const isGood = score >= 3;
      
      const newUsage: AIUsage = {
        id: crypto.randomUUID(),
        category: formData.category,
        question: formData.question,
        reason: formData.reason,
        score,
        analysis: isGood 
          ? 'Utilisation pertinente de l\'IA pour améliorer votre productivité.'
          : 'Cette utilisation pourrait être évitée. Essayez de chercher par vous-même d\'abord.',
        suggestion: isGood
          ? 'Continuez à utiliser l\'IA pour des tâches similaires.'
          : 'Prenez le temps de réfléchir avant de recourir à l\'IA.',
        timestamp: new Date().toISOString(),
      };

      const updated = [newUsage, ...usages];
      setUsages(updated);
      saveAIUsage(updated);

      const xpChange = isGood ? XP_CONFIG.AI_USAGE_GOOD : XP_CONFIG.AI_USAGE_BAD;
      addXP(xpChange);

      toast({
        title: isGood ? 'Utilisation validée' : 'Utilisation questionnable',
        description: `Score: ${score}/5 — ${xpChange > 0 ? '+' : ''}${xpChange} XP`,
      });

      setFormData({ category: '', question: '', reason: '' });
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <TrendingUp className="w-4 h-4 text-accent" />;
    if (score <= 1) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <PageContainer title="Journal IA" subtitle="Suivez votre utilisation de l'IA">
      {/* Stats */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">7 derniers jours</h3>
          <span className="text-sm text-muted-foreground">{usages.length} total</span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {last7Days.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-widget-ai/30 rounded-t-lg transition-all duration-300"
                style={{ height: `${Math.max(8, (day.count / maxCount) * 100)}%` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <button 
        onClick={() => setShowForm(!showForm)}
        className="ios-button w-full mb-6 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Ajouter une utilisation
      </button>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-5 mb-6 animate-slide-up">
          <h3 className="font-semibold text-foreground mb-4">Nouvelle utilisation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-all',
                      formData.category === cat 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Question posée à l'IA</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/50 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
                rows={3}
                placeholder="Qu'avez-vous demandé à l'IA ?"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Raison de l'utilisation</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/50 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
                rows={2}
                placeholder="Pourquoi avez-vous utilisé l'IA ?"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ios-button w-full"
            >
              {isSubmitting ? 'Analyse en cours...' : 'Soumettre pour analyse'}
            </button>
          </div>
        </div>
      )}

      {/* Usage List */}
      <div className="space-y-3">
        {usages.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Brain className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune utilisation enregistrée</p>
            <p className="text-sm text-muted-foreground/70">Ajoutez votre première utilisation</p>
          </div>
        ) : (
          usages.map((usage, i) => (
            <div 
              key={usage.id}
              className="glass-card p-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                      {usage.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(usage.timestamp).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{usage.question}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getScoreIcon(usage.score)}
                  <span className={cn(
                    'text-lg font-bold',
                    usage.score >= 3 ? 'text-accent' : 'text-destructive'
                  )}>
                    {usage.score}/5
                  </span>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">{usage.analysis}</p>
                <p className="text-xs text-primary">{usage.suggestion}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default Journal;

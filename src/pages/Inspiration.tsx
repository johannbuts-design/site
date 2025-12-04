import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RefreshCw, Palette, BookOpen, User, Image, Music, Lightbulb, Type, Pencil, ExternalLink, Loader2 } from 'lucide-react';
import { getInspiration, saveInspiration, addXP, XP_CONFIG } from '@/services/storage';
import { generateMockInspiration } from '@/services/mockData';
import { generateInspiration as generateAIInspiration } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const Inspiration = () => {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [inspiration, setInspiration] = useState(() => {
    let inspi = getInspiration(today);
    if (!inspi) {
      const mock = generateMockInspiration();
      inspi = { ...mock, id: crypto.randomUUID(), date: today };
      saveInspiration(today, inspi);
      addXP(XP_CONFIG.INSPIRATION_VIEW);
    }
    return inspi;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

const handleRefresh = async () => {
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
toast({ title: 'Nouvelle inspiration IA' });


    const newId = crypto.randomUUID();
    const newDateKey = `${today}-${newId}`;
    const newInspi = { ...newInspiData, id: newId, date: newDateKey };

    saveInspiration(newDateKey, newInspi);
    setInspiration(newInspi);

  } catch (error) {
    console.error('Refresh error:', error);
  } finally {
    setIsRefreshing(false);
  }
};


  const Section = ({ icon: Icon, title, gradient, children }: { icon: any; title: string; gradient: string; children: React.ReactNode }) => (
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
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ios-button flex items-center gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isRefreshing ? 'Génération...' : 'Régénérer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Artist */}
        <Section icon={Palette} title="Artiste / Style" gradient="bg-gradient-inspiration">
          <h3 className="text-xl font-bold text-foreground mb-2">{inspiration.artist.name}</h3>
          <p className="text-sm text-primary font-medium mb-2">{inspiration.artist.style}</p>
          <p className="text-sm text-muted-foreground mb-4">{inspiration.artist.description}</p>
          <div className="flex gap-2">
            {inspiration.artist.palette.map((color, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-xl shadow-sm border border-border/50"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </Section>

        {/* Personality */}
        <Section icon={User} title="Personnalité" gradient="bg-gradient-profile">
          <h3 className="text-xl font-bold text-foreground mb-2">{inspiration.personality.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{inspiration.personality.bio}</p>
          <a 
            href={inspiration.personality.wikiLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Wikipedia
          </a>
        </Section>

        {/* Book */}
        <Section icon={BookOpen} title="Livre" gradient="bg-gradient-notes">
          <h3 className="text-xl font-bold text-foreground mb-1">{inspiration.book.title}</h3>
          <p className="text-sm text-primary font-medium mb-3">{inspiration.book.author}</p>
          <p className="text-sm text-muted-foreground mb-3">{inspiration.book.summary}</p>
          <div className="p-3 rounded-xl bg-secondary/50 space-y-2">
            <p className="text-xs text-muted-foreground"><strong>Contexte :</strong> {inspiration.book.context}</p>
            <p className="text-xs text-muted-foreground"><strong>Importance :</strong> {inspiration.book.importance}</p>
          </div>
        </Section>

        {/* Artwork */}
        <Section icon={Image} title="Œuvre d'art" gradient="bg-gradient-quiz">
          <h3 className="text-xl font-bold text-foreground mb-1">{inspiration.artwork.name}</h3>
          <p className="text-sm text-primary font-medium mb-3">{inspiration.artwork.artist}</p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground"><strong>Techniques :</strong> {inspiration.artwork.techniques}</p>
            <p className="text-sm text-muted-foreground"><strong>Signification :</strong> {inspiration.artwork.meaning}</p>
          </div>
        </Section>

        {/* Album */}
        <Section icon={Music} title="Album français" gradient="bg-gradient-ai">
          <h3 className="text-xl font-bold text-foreground mb-1">{inspiration.album.title}</h3>
          <p className="text-sm text-primary font-medium mb-2">{inspiration.album.artist}</p>
          <p className="text-sm text-muted-foreground mb-4">{inspiration.album.style}</p>
          <a 
            href={inspiration.album.spotifyLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB954] text-white text-sm font-medium hover:brightness-110 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Écouter sur Spotify
          </a>
        </Section>

        {/* Invention */}
        <Section icon={Lightbulb} title="Invention" gradient="bg-gradient-routine">
          <h3 className="text-xl font-bold text-foreground mb-1">{inspiration.invention.name}</h3>
          <p className="text-sm text-primary font-medium mb-2">{inspiration.invention.inventor} — {inspiration.invention.date}</p>
          <p className="text-sm text-muted-foreground">{inspiration.invention.impact}</p>
        </Section>

        {/* Word */}
        <Section icon={Type} title="Mot rare" gradient="bg-gradient-inspiration">
          <h3 className="text-xl font-bold text-foreground mb-2">{inspiration.word.word}</h3>
          <p className="text-sm text-muted-foreground mb-3">{inspiration.word.definition}</p>
          <div className="space-y-2 p-3 rounded-xl bg-secondary/50">
            <p className="text-xs text-muted-foreground"><strong>Étymologie :</strong> {inspiration.word.etymology}</p>
            <p className="text-xs text-muted-foreground"><strong>Exemple :</strong> <em>"{inspiration.word.example}"</em></p>
          </div>
        </Section>

        {/* Exercise */}
        <div className="lg:col-span-2">
          <Section icon={Pencil} title="Exercice créatif" gradient="bg-gradient-profile">
            <p className="text-base text-foreground leading-relaxed">{inspiration.exercise}</p>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Inspiration;

import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getInspiration, saveInspiration, addXP, XP_CONFIG, markInspirationViewed } from '@/services/storage';
import { generateMockInspiration } from '@/services/mockData';

export function InspirationWidget() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [inspiration, setInspiration] = useState(() => {
    let inspi = getInspiration(today);
    if (!inspi) {
      const mock = generateMockInspiration();
      inspi = { ...mock, id: crypto.randomUUID(), date: today };
      saveInspiration(today, inspi);
      addXP(XP_CONFIG.INSPIRATION_VIEW);
      markInspirationViewed(today);
    }
    return inspi;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => {
      const mock = generateMockInspiration();
      const newInspi = { ...mock, id: crypto.randomUUID(), date: today };
      saveInspiration(today, newInspi);
      setInspiration(newInspi);
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="widget-card" onClick={() => navigate('/inspiration')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-inspiration">
          <Sparkles className="w-5 h-5" />
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <h3 className="font-semibold text-foreground mb-2">Inspiration du jour</h3>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          <span className="font-medium text-foreground">{inspiration.artist.name}</span> — {inspiration.artist.style}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          📚 {inspiration.book.title} de {inspiration.book.author}
        </p>
      </div>

      <div className="flex gap-1 mb-4">
        {inspiration.artist.palette.slice(0, 5).map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border border-border/50"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Voir l'inspiration complète <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

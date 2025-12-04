import { Brain, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getQuizStats } from '@/services/storage';

export function QuizWidget() {
  const navigate = useNavigate();
  const codeStats = getQuizStats('code');
  const inspiStats = getQuizStats('inspiration');

  return (
    <div className="widget-card" onClick={() => navigate('/quiz')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-quiz">
          <Brain className="w-5 h-5" />
        </div>
        <Trophy className="w-4 h-4 text-muted-foreground" />
      </div>

      <h3 className="font-semibold text-foreground mb-3">Quiz</h3>

      <div className="space-y-3 mb-4">
        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Code de la route</span>
            <span className="text-xs text-muted-foreground">{codeStats.count} quiz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">{codeStats.best}%</span>
            <span className="text-xs text-muted-foreground">meilleur score</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Inspiration</span>
            <span className="text-xs text-muted-foreground">{inspiStats.count} quiz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">{inspiStats.best}%</span>
            <span className="text-xs text-muted-foreground">meilleur score</span>
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Commencer un quiz <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

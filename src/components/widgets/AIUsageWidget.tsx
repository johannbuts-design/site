import { Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTodayAIUsageCount, getLast7DaysAIUsage } from '@/services/storage';

export function AIUsageWidget() {
  const navigate = useNavigate();
  const todayCount = getTodayAIUsageCount();
  const last7Days = getLast7DaysAIUsage();
  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="widget-card" onClick={() => navigate('/journal')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-ai">
          <Brain className="w-5 h-5" />
        </div>
        <span className="text-xs text-muted-foreground">Aujourd'hui</span>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-foreground">{todayCount}</p>
        <p className="text-sm text-muted-foreground">utilisations IA</p>
      </div>

      <div className="flex items-end gap-1 h-12 mb-4">
        {last7Days.map((day, i) => (
          <div
            key={day.date}
            className="flex-1 bg-widget-ai/20 rounded-t-sm transition-all duration-300"
            style={{ 
              height: `${Math.max(10, (day.count / maxCount) * 100)}%`,
              opacity: 0.4 + (i / last7Days.length) * 0.6 
            }}
          />
        ))}
      </div>

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Voir le journal <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

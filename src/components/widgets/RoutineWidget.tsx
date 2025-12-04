import { CheckSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRoutine, saveRoutine, addXP, XP_CONFIG, RoutineTask } from '@/services/storage';
import { generateMockRoutineTasks } from '@/services/mockData';
import { cn } from '@/lib/utils';

export function RoutineWidget() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useState<RoutineTask[]>([]);

  useEffect(() => {
    let routine = getRoutine(today);
    if (routine.length === 0) {
      routine = generateMockRoutineTasks(today);
      saveRoutine(today, routine);
    }
    setTasks(routine);
  }, [today]);

  const toggleTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        addXP(newCompleted ? XP_CONFIG.ROUTINE_COMPLETE : XP_CONFIG.ROUTINE_MISSED);
        return { ...t, completed: newCompleted };
      }
      return t;
    });
    setTasks(updated);
    saveRoutine(today, updated);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="widget-card" onClick={() => navigate('/routine')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-routine">
          <CheckSquare className="w-5 h-5" />
        </div>
        <span className="text-xs text-muted-foreground">{completedCount}/{tasks.length}</span>
      </div>

      <h3 className="font-semibold text-foreground mb-3">Routine du jour</h3>

      <div className="progress-bar mb-4">
        <div 
          className="progress-bar-fill bg-gradient-routine"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
        {tasks.slice(0, 4).map(task => (
          <div 
            key={task.id}
            className="flex items-center gap-3"
          >
            <button
              onClick={(e) => toggleTask(task.id, e)}
              className={cn(
                'ios-checkbox',
                task.completed && 'checked'
              )}
            >
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm truncate',
                task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
              )}>
                {task.title}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{task.time}</span>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Voir la routine complète <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

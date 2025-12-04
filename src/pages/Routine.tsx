import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RefreshCw, Clock, Shuffle } from 'lucide-react';
import { getRoutine, saveRoutine, addXP, XP_CONFIG, RoutineTask, checkAndAwardBadges } from '@/services/storage';
import { generateMockRoutineTasks } from '@/services/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Routine = () => {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let routine = getRoutine(today);
    if (routine.length === 0) {
      routine = generateMockRoutineTasks(today);
      saveRoutine(today, routine);
    }
    setTasks(routine);
  }, [today]);

  const toggleTask = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        const xpChange = newCompleted ? XP_CONFIG.ROUTINE_COMPLETE : XP_CONFIG.ROUTINE_MISSED;
        addXP(xpChange);
        
        toast({
          title: newCompleted ? 'Tâche complétée !' : 'Tâche annulée',
          description: `${xpChange > 0 ? '+' : ''}${xpChange} XP`,
        });

        return { ...t, completed: newCompleted };
      }
      return t;
    });
    setTasks(updated);
    saveRoutine(today, updated);

    // Check for new badges
    const newBadges = checkAndAwardBadges();
    if (newBadges.length > 0) {
      toast({
        title: '🎉 Nouveau badge !',
        description: `Vous avez débloqué un nouveau badge !`,
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newRoutine = generateMockRoutineTasks(today);
      saveRoutine(today, newRoutine);
      setTasks(newRoutine);
      setIsRefreshing(false);
    }, 500);
  };

  const fixedTasks = tasks.filter(t => t.type === 'fixed');
  const variableTasks = tasks.filter(t => t.type === 'variable');
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const TaskItem = ({ task }: { task: RoutineTask }) => (
    <div 
      className={cn(
        'glass-card p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01]',
        task.completed && 'opacity-60'
      )}
      onClick={() => toggleTask(task.id)}
    >
      <button
        className={cn(
          'ios-checkbox flex-shrink-0',
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
          'font-medium',
          task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
        )}>
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {task.type === 'fixed' ? 'Tâche fixe' : 'Tâche variable'}
        </p>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">{task.time}</span>
      </div>
    </div>
  );

  return (
    <PageContainer title="Routine du jour" subtitle={new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}>
      {/* Progress Header */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-foreground">{completedCount}/{tasks.length}</p>
            <p className="text-sm text-muted-foreground">tâches complétées</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ios-button-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Régénérer variables
          </button>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-bar-fill bg-gradient-routine"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Fixed Tasks */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Horaires fixes</h2>
        </div>
        <div className="space-y-3">
          {fixedTasks.map((task, i) => (
            <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      </section>

      {/* Variable Tasks */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Tâches variables (IA)</h2>
        </div>
        <div className="space-y-3">
          {variableTasks.map((task, i) => (
            <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${(fixedTasks.length + i) * 0.05}s` }}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
};

export default Routine;

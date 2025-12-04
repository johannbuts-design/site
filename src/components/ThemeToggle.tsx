import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-14 h-8 rounded-full transition-all duration-300',
        'bg-secondary hover:bg-muted',
        'flex items-center p-1',
        className
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          'absolute w-6 h-6 rounded-full transition-all duration-300',
          'flex items-center justify-center',
          'bg-primary text-primary-foreground shadow-lg',
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        )}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}

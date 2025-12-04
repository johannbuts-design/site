import { Home, BookOpen, CheckSquare, FileText, BarChart3, User, Sparkles, Brain } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Sparkles, label: 'Inspiration', path: '/inspiration' },
  { icon: CheckSquare, label: 'Routine', path: '/routine' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Brain, label: 'Quiz', path: '/quiz' },
  { icon: BookOpen, label: 'Journal IA', path: '/journal' },
  { icon: BarChart3, label: 'Stats', path: '/stats' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none rounded-t-3xl border-t border-border/50 md:top-0 md:bottom-auto md:rounded-none md:rounded-b-3xl md:border-b md:border-t-0">
      <div className="container mx-auto px-2 py-2 md:py-3">
        <div className="flex items-center justify-around md:justify-center md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'nav-item flex-1 md:flex-none md:px-4',
                  isActive && 'active'
                )}
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          {/* Theme toggle - desktop only */}
          <div className="hidden md:flex items-center ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

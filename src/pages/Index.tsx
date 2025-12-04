import { PageContainer } from '@/components/layout/PageContainer';
import { AIUsageWidget } from '@/components/widgets/AIUsageWidget';
import { InspirationWidget } from '@/components/widgets/InspirationWidget';
import { RoutineWidget } from '@/components/widgets/RoutineWidget';
import { NotesWidget } from '@/components/widgets/NotesWidget';
import { QuizWidget } from '@/components/widgets/QuizWidget';
import { ProfileWidget } from '@/components/widgets/ProfileWidget';
import { getProfile } from '@/services/storage';

const Index = () => {
  const profile = getProfile();
  const now = new Date();
  const hours = now.getHours();
  
  let greeting = 'Bonjour';
  if (hours >= 18) greeting = 'Bonsoir';
  else if (hours >= 12) greeting = 'Bon après-midi';

  return (
    <PageContainer>
      <header className="mb-8 animate-slide-up">
        <p className="text-muted-foreground text-sm mb-1">{greeting},</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{profile.pseudo}</h1>
        <p className="text-muted-foreground mt-2">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <RoutineWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <InspirationWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <AIUsageWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <NotesWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <QuizWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <ProfileWidget />
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;

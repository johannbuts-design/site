import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { User, Star, Edit2, Check, Moon, Sun } from 'lucide-react';
import { getProfile, saveProfile, getXPForNextLevel, BADGES, LEVELS, getRoutineStreak } from '@/services/storage';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const Profile = () => {
  const [profile, setProfile] = useState(getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.pseudo);
  const xpProgress = getXPForNextLevel(profile.xp);
  const streak = getRoutineStreak();
  const { theme, toggleTheme } = useTheme();

  const handleSave = () => {
    const updated = { ...profile, pseudo: editName };
    saveProfile(updated);
    setProfile(updated);
    setIsEditing(false);
  };

  const allBadges = Object.values(BADGES);

  return (
    <PageContainer>
      {/* Profile Header */}
      <div className="glass-card p-6 mb-6 animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="widget-icon bg-gradient-profile w-16 h-16">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xl font-bold bg-secondary/50 rounded-xl px-3 py-1 outline-none text-foreground"
                  autoFocus
                />
                <button onClick={handleSave} className="p-2 rounded-xl bg-accent text-white">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{profile.pseudo}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
            <p className="text-muted-foreground">
              Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
            <Star className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">Niveau {profile.level}</span>
          </div>
          <span className="text-muted-foreground">{profile.xp} XP</span>
        </div>

        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Progression vers niveau {profile.level + 1}</span>
          <span>{Math.round(xpProgress.progress)}%</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-bar-fill bg-gradient-profile"
            style={{ width: `${xpProgress.progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {xpProgress.next - profile.xp} XP restants
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-3xl font-bold text-foreground">{profile.level}</p>
          <p className="text-xs text-muted-foreground">Niveau</p>
        </div>
        <div className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-3xl font-bold text-foreground">{profile.xp}</p>
          <p className="text-xs text-muted-foreground">XP Total</p>
        </div>
        <div className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-3xl font-bold text-foreground">{profile.badges.length}</p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </div>
        <div className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-3xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground">Jours de suite</p>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const unlocked = profile.badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={cn(
                  'p-4 rounded-2xl text-center transition-all',
                  unlocked ? 'bg-primary/10' : 'bg-secondary/50 badge-locked'
                )}
              >
                <span className="text-4xl block mb-2">{badge.icon}</span>
                <p className={cn(
                  'font-semibold',
                  unlocked ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {badge.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="glass-card p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Apparence</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-foreground">Mode {theme === 'dark' ? 'sombre' : 'clair'}</span>
          </div>
          <button
            onClick={toggleTheme}
            className={cn(
              'relative w-14 h-8 rounded-full transition-all duration-300',
              theme === 'dark' ? 'bg-primary' : 'bg-secondary'
            )}
          >
            <div
              className={cn(
                'absolute w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 top-1',
                theme === 'dark' ? 'left-7' : 'left-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Levels Guide */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Niveaux</h2>
        <div className="space-y-2">
          {LEVELS.map((lvl) => (
            <div 
              key={lvl.level}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl transition-colors',
                profile.level >= lvl.level ? 'bg-primary/10' : 'bg-secondary/50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  profile.level >= lvl.level ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                )}>
                  {lvl.level}
                </span>
                <span className={cn(
                  'font-medium',
                  profile.level >= lvl.level ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Niveau {lvl.level}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{lvl.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;

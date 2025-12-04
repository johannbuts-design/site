import { User, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getXPForNextLevel, BADGES } from '@/services/storage';

export function ProfileWidget() {
  const navigate = useNavigate();
  const profile = getProfile();
  const xpProgress = getXPForNextLevel(profile.xp);
  const lastBadge = profile.badges[profile.badges.length - 1];
  const badgeInfo = BADGES[lastBadge?.toUpperCase() as keyof typeof BADGES];

  return (
    <div className="widget-card" onClick={() => navigate('/profile')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-profile">
          <User className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
          <Star className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">Niv. {profile.level}</span>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-1">{profile.pseudo}</h3>
      <p className="text-sm text-muted-foreground mb-3">{profile.xp} XP</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Progression</span>
          <span>{Math.round(xpProgress.progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill bg-gradient-profile"
            style={{ width: `${xpProgress.progress}%` }}
          />
        </div>
      </div>

      {badgeInfo && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50 mb-4">
          <span className="text-xl">{badgeInfo.icon}</span>
          <div>
            <p className="text-xs font-medium text-foreground">{badgeInfo.name}</p>
            <p className="text-xs text-muted-foreground">Dernier badge</p>
          </div>
        </div>
      )}

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Voir le profil <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

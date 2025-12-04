// LocalStorage Service for FOCUSBOARD

export interface UserProfile {
  pseudo: string;
  xp: number;
  level: number;
  badges: string[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  time: string;
  type: 'fixed' | 'variable';
  completed: boolean;
  date: string;
}

export interface AIUsage {
  id: string;
  category: string;
  question: string;
  reason: string;
  score: number;
  analysis: string;
  suggestion: string;
  timestamp: string;
}

export interface Inspiration {
  id: string;
  date: string;
  artist: { style: string; name: string; description: string; palette: string[] };
  personality: { name: string; bio: string; wikiLink: string };
  book: { title: string; author: string; summary: string; context: string; importance: string };
  artwork: { name: string; artist: string; techniques: string; meaning: string };
  album: { title: string; artist: string; style: string; spotifyLink: string };
  invention: { name: string; inventor: string; date: string; impact: string };
  word: { word: string; definition: string; etymology: string; example: string };
  exercise: string;
}

export interface QuizResult {
  id: string;
  type: 'code' | 'inspiration';
  score: number;
  total: number;
  date: string;
}

const STORAGE_KEYS = {
  PROFILE: 'focusboard_profile',
  NOTES: 'focusboard_notes',
  ROUTINE: 'focusboard_routine',
  AI_USAGE: 'focusboard_ai_usage',
  INSPIRATION: 'focusboard_inspiration',
  QUIZ_RESULTS: 'focusboard_quiz_results',
  INSPIRATIONS_VIEWED: 'focusboard_inspirations_viewed',
};

// XP System
export const XP_CONFIG = {
  ROUTINE_COMPLETE: 10,
  ROUTINE_MISSED: -5,
  INSPIRATION_VIEW: 20,
  AI_USAGE_GOOD: 10,
  AI_USAGE_BAD: -10,
  QUIZ_CODE_MULTIPLIER: 1,
  QUIZ_INSPI_MULTIPLIER: 0.5,
};

export const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 200 },
  { level: 3, xp: 500 },
  { level: 4, xp: 900 },
  { level: 5, xp: 1400 },
  { level: 6, xp: 2000 },
  { level: 7, xp: 2600 },
  { level: 8, xp: 3200 },
  { level: 9, xp: 3800 },
  { level: 10, xp: 4400 },
];

export const BADGES = {
  BEGINNER: { id: 'beginner', name: 'Débutant', description: 'Atteindre niveau 1', icon: '🌱' },
  MORNING: { id: 'morning', name: 'Matinal', description: 'Routine complète 3 jours', icon: '☀️' },
  CULTURE: { id: 'culture', name: 'Culture G', description: '>90 au quiz inspiration', icon: '🎭' },
  DRIVER: { id: 'driver', name: 'Permis A+', description: '>90 au quiz route', icon: '🚗' },
  NOLIFE: { id: 'nolife', name: 'No Life', description: 'Routine 7 jours complets', icon: '🏆' },
  EXPLORER: { id: 'explorer', name: 'Explorateur', description: '10 inspirations vues', icon: '🧭' },
};

// Profile
export function getProfile(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) return JSON.parse(stored);
  
  const defaultProfile: UserProfile = {
    pseudo: 'Utilisateur',
    xp: 0,
    level: 1,
    badges: ['beginner'],
    createdAt: new Date().toISOString(),
  };
  saveProfile(defaultProfile);
  return defaultProfile;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function addXP(amount: number): UserProfile {
  const profile = getProfile();
  profile.xp = Math.max(0, profile.xp + amount);
  
  // Update level
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (profile.xp >= LEVELS[i].xp) {
      profile.level = LEVELS[i].level;
      break;
    }
  }
  
  saveProfile(profile);
  return profile;
}

export function getXPForNextLevel(currentXP: number): { current: number; next: number; progress: number } {
  let currentLevelXP = 0;
  let nextLevelXP = 200;
  
  for (let i = 0; i < LEVELS.length; i++) {
    if (currentXP >= LEVELS[i].xp) {
      currentLevelXP = LEVELS[i].xp;
      nextLevelXP = LEVELS[i + 1]?.xp || LEVELS[i].xp + 600;
    }
  }
  
  const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { current: currentXP, next: nextLevelXP, progress: Math.min(100, Math.max(0, progress)) };
}

// Notes
export function getNotes(): Note[] {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
  return stored ? JSON.parse(stored) : [];
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getPinnedNotes(): Note[] {
  return getNotes().filter(note => note.pinned);
}

// Routine
export function getRoutine(date: string): RoutineTask[] {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINE);
  const allRoutines: Record<string, RoutineTask[]> = stored ? JSON.parse(stored) : {};
  return allRoutines[date] || [];
}

export function saveRoutine(date: string, tasks: RoutineTask[]): void {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINE);
  const allRoutines: Record<string, RoutineTask[]> = stored ? JSON.parse(stored) : {};
  allRoutines[date] = tasks;
  localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(allRoutines));
}

export function getRoutineStreak(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINE);
  const allRoutines: Record<string, RoutineTask[]> = stored ? JSON.parse(stored) : {};
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const tasks = allRoutines[dateStr];
    
    if (tasks && tasks.length > 0 && tasks.every(t => t.completed)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

// AI Usage
export function getAIUsage(): AIUsage[] {
  const stored = localStorage.getItem(STORAGE_KEYS.AI_USAGE);
  return stored ? JSON.parse(stored) : [];
}

export function saveAIUsage(usage: AIUsage[]): void {
  localStorage.setItem(STORAGE_KEYS.AI_USAGE, JSON.stringify(usage));
}

export function getTodayAIUsageCount(): number {
  const today = new Date().toISOString().split('T')[0];
  return getAIUsage().filter(u => u.timestamp.startsWith(today)).length;
}

export function getLast7DaysAIUsage(): { date: string; count: number }[] {
  const usage = getAIUsage();
  const result: { date: string; count: number }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = usage.filter(u => u.timestamp.startsWith(dateStr)).length;
    result.push({ date: dateStr, count });
  }
  
  return result;
}

// Inspiration
export function getInspiration(date: string): Inspiration | null {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATION);
  const all: Record<string, Inspiration> = stored ? JSON.parse(stored) : {};
  return all[date] || null;
}

export function saveInspiration(date: string, inspiration: Inspiration): void {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATION);
  const all: Record<string, Inspiration> = stored ? JSON.parse(stored) : {};
  all[date] = inspiration;
  localStorage.setItem(STORAGE_KEYS.INSPIRATION, JSON.stringify(all));
  
  // Also save to viewed inspirations
  saveInspirationViewed(inspiration);
}

export function getAllInspirations(): Record<string, Inspiration> {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATION);
  return stored ? JSON.parse(stored) : {};
}

export function getInspirationsViewedCount(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATIONS_VIEWED);
  return stored ? JSON.parse(stored).length : 0;
}

export function getAllViewedInspirations(): Inspiration[] {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATIONS_VIEWED);
  return stored ? JSON.parse(stored) : [];
}

export function saveInspirationViewed(inspiration: Inspiration): void {
  const stored = localStorage.getItem(STORAGE_KEYS.INSPIRATIONS_VIEWED);
  const viewed: Inspiration[] = stored ? JSON.parse(stored) : [];
  // Check if already exists by id
  if (!viewed.find(v => v.id === inspiration.id)) {
    viewed.push(inspiration);
    localStorage.setItem(STORAGE_KEYS.INSPIRATIONS_VIEWED, JSON.stringify(viewed));
  }
}

export function markInspirationViewed(date: string): void {
  // Legacy function - now handled by saveInspiration
  const inspiration = getInspiration(date);
  if (inspiration) {
    saveInspirationViewed(inspiration);
  }
}

// Quiz
export function getQuizResults(): QuizResult[] {
  const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
  return stored ? JSON.parse(stored) : [];
}

export function saveQuizResult(result: QuizResult): void {
  const results = getQuizResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
}

export function getQuizStats(type: 'code' | 'inspiration'): { avg: number; best: number; count: number } {
  const results = getQuizResults().filter(r => r.type === type);
  if (results.length === 0) return { avg: 0, best: 0, count: 0 };
  
  const scores = results.map(r => (r.score / r.total) * 100);
  return {
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    best: Math.round(Math.max(...scores)),
    count: results.length,
  };
}

// Badge checking
export function checkAndAwardBadges(): string[] {
  const profile = getProfile();
  const newBadges: string[] = [];
  
  // Matinal - 3 days streak
  if (!profile.badges.includes('morning') && getRoutineStreak() >= 3) {
    profile.badges.push('morning');
    newBadges.push('morning');
  }
  
  // No Life - 7 days streak
  if (!profile.badges.includes('nolife') && getRoutineStreak() >= 7) {
    profile.badges.push('nolife');
    newBadges.push('nolife');
  }
  
  // Culture G - >90 quiz inspiration
  const inspiStats = getQuizStats('inspiration');
  if (!profile.badges.includes('culture') && inspiStats.best > 90) {
    profile.badges.push('culture');
    newBadges.push('culture');
  }
  
  // Permis A+ - >90 quiz code
  const codeStats = getQuizStats('code');
  if (!profile.badges.includes('driver') && codeStats.best > 90) {
    profile.badges.push('driver');
    newBadges.push('driver');
  }
  
  // Explorer - 10 inspirations viewed
  if (!profile.badges.includes('explorer') && getInspirationsViewedCount() >= 10) {
    profile.badges.push('explorer');
    newBadges.push('explorer');
  }
  
  if (newBadges.length > 0) {
    saveProfile(profile);
  }
  
  return newBadges;
}

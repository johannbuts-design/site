import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Car, Sparkles, Trophy, ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { saveQuizResult, addXP, XP_CONFIG, getQuizStats, checkAndAwardBadges, getAllViewedInspirations } from '@/services/storage';
import { generateQuizCode, generateQuizInspiration } from '@/services/aiService';
import { generateMockQuizCode, generateMockQuizInspiration } from '@/services/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type QuizMode = 'select' | 'code' | 'inspiration' | 'results';

const Quiz = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<QuizMode>('select');
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correct: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const codeStats = getQuizStats('code');
  const inspiStats = getQuizStats('inspiration');
  const viewedInspirations = getAllViewedInspirations();

  const startQuiz = async (type: 'code' | 'inspiration') => {
    setIsLoading(true);
    
    try {
      let quizQuestions: { question: string; options: string[]; correct: number }[] = [];
      
      if (type === 'code') {
        // Try AI first, fallback to mock
        const aiResult = await generateQuizCode();
       if (aiResult.data?.questions) {
  quizQuestions = aiResult.data.questions;
} else {
  throw new Error('Aucune donnée IA reçue');
}
      } else {
        // Quiz inspiration - based on viewed inspirations
        if (viewedInspirations.length === 0) {
          toast({
            title: 'Pas d\'inspirations',
            description: 'Consultez d\'abord quelques inspirations !',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        const aiResult = await generateQuizInspiration(viewedInspirations);
        if (aiResult.data?.questions) {
          quizQuestions = aiResult.data.questions;
        } else {
          quizQuestions = generateMockQuizInspiration(viewedInspirations.map(i => JSON.stringify(i)));
          toast({
            title: 'Mode hors-ligne',
            description: 'Quiz généré localement',
            variant: 'default',
          });
        }
      }

      setQuestions(quizQuestions);
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowCorrect(false);
      setMode(type);
    } catch (error) {
      console.error('Quiz start error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer le quiz',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (index: number) => {
    if (showCorrect) return;
    setSelectedAnswer(index);
    setShowCorrect(true);
    setAnswers([...answers, index]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowCorrect(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const type = mode as 'code' | 'inspiration';
    
    saveQuizResult({
      id: crypto.randomUUID(),
      type,
      score: correctCount,
      total: questions.length,
      date: new Date().toISOString(),
    });

    const xpGain = Math.round(score * (type === 'code' ? XP_CONFIG.QUIZ_CODE_MULTIPLIER : XP_CONFIG.QUIZ_INSPI_MULTIPLIER));
    addXP(xpGain);

    toast({
      title: `Quiz terminé !`,
      description: `Score: ${score}% — +${xpGain} XP`,
    });

    const newBadges = checkAndAwardBadges();
    if (newBadges.length > 0) {
      toast({
        title: '🎉 Nouveau badge !',
        description: 'Vous avez débloqué un nouveau badge !',
      });
    }

    setMode('results');
  };

  const currentQuestion = questions[currentIndex];

  if (mode === 'select') {
    return (
      <PageContainer title="Quiz" subtitle="Testez vos connaissances">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Code de la route */}
          <div 
            className={cn(
              "glass-card p-6 cursor-pointer hover:scale-[1.02] transition-all animate-slide-up",
              isLoading && "pointer-events-none opacity-60"
            )}
            onClick={() => !isLoading && startQuiz('code')}
          >
            <div className="widget-icon bg-gradient-quiz w-14 h-14 mb-4">
              {isLoading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Car className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Code de la route</h2>
            <p className="text-muted-foreground mb-4">20 questions QCM générées par IA</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{codeStats.best}%</p>
                <p className="text-xs text-muted-foreground">Meilleur score</p>
              </div>
              <button className="ios-button flex items-center gap-2" disabled={isLoading}>
                {isLoading ? 'Chargement...' : 'Commencer'} 
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Inspiration */}
          <div 
            className={cn(
              "glass-card p-6 cursor-pointer hover:scale-[1.02] transition-all animate-slide-up",
              isLoading && "pointer-events-none opacity-60"
            )}
            style={{ animationDelay: '0.1s' }}
            onClick={() => !isLoading && startQuiz('inspiration')}
          >
            <div className="widget-icon bg-gradient-inspiration w-14 h-14 mb-4">
              {isLoading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Sparkles className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Inspiration</h2>
            <p className="text-muted-foreground mb-4">
              {viewedInspirations.length === 0 
                ? 'Consultez d\'abord des inspirations' 
                : `${viewedInspirations.length} inspiration${viewedInspirations.length > 1 ? 's' : ''} vue${viewedInspirations.length > 1 ? 's' : ''}`
              }
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{inspiStats.best}%</p>
                <p className="text-xs text-muted-foreground">Meilleur score</p>
              </div>
              <button 
                className="ios-button flex items-center gap-2" 
                disabled={isLoading || viewedInspirations.length === 0}
              >
                {isLoading ? 'Chargement...' : 'Commencer'} 
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-6 mt-8 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Statistiques</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{codeStats.count}</p>
              <p className="text-xs text-muted-foreground">Quiz code</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{codeStats.avg}%</p>
              <p className="text-xs text-muted-foreground">Moyenne code</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{inspiStats.count}</p>
              <p className="text-xs text-muted-foreground">Quiz inspi</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{inspiStats.avg}%</p>
              <p className="text-xs text-muted-foreground">Moyenne inspi</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (mode === 'results') {
    const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <PageContainer title="Résultats" subtitle="Quiz terminé">
        <div className="glass-card p-8 max-w-lg mx-auto text-center animate-scale-in">
          <div className={cn(
            'w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center',
            score >= 80 ? 'bg-accent/20' : score >= 50 ? 'bg-widget-notes/20' : 'bg-destructive/20'
          )}>
            <Trophy className={cn(
              'w-12 h-12',
              score >= 80 ? 'text-accent' : score >= 50 ? 'text-widget-notes' : 'text-destructive'
            )} />
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-2">{score}%</h2>
          <p className="text-muted-foreground mb-6">{correctCount} / {questions.length} bonnes réponses</p>

          <div className="space-y-3 mb-8 max-h-64 overflow-y-auto">
            {questions.map((q, i) => (
              <div 
                key={i}
                className={cn(
                  'p-3 rounded-xl flex items-center gap-3',
                  answers[i] === q.correct ? 'bg-accent/10' : 'bg-destructive/10'
                )}
              >
                {answers[i] === q.correct ? (
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-destructive flex-shrink-0" />
                )}
                <p className="text-sm text-left text-foreground">{q.question}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setMode('select')}
            className="ios-button w-full"
          >
            Retour aux quiz
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title={mode === 'code' ? 'Code de la route' : 'Quiz Inspiration'} 
      subtitle={`Question ${currentIndex + 1} / ${questions.length}`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="progress-bar mb-8">
          <div 
            className={cn(
              'progress-bar-fill',
              mode === 'code' ? 'bg-gradient-quiz' : 'bg-gradient-inspiration'
            )}
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="glass-card p-6 mb-6 animate-fade-in">
          <p className="text-lg font-medium text-foreground">{currentQuestion?.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion?.options.map((option, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={showCorrect}
              className={cn(
                'w-full p-4 rounded-2xl text-left transition-all',
                'glass-card hover:scale-[1.01]',
                showCorrect && i === currentQuestion.correct && 'ring-2 ring-accent bg-accent/10',
                showCorrect && selectedAnswer === i && i !== currentQuestion.correct && 'ring-2 ring-destructive bg-destructive/10',
                !showCorrect && selectedAnswer === i && 'ring-2 ring-primary'
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  showCorrect && i === currentQuestion.correct ? 'bg-accent text-white' :
                  showCorrect && selectedAnswer === i ? 'bg-destructive text-white' :
                  'bg-secondary text-muted-foreground'
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {showCorrect && (
          <button 
            onClick={nextQuestion}
            className="ios-button w-full flex items-center justify-center gap-2 animate-fade-in"
          >
            {currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </PageContainer>
  );
};

export default Quiz;

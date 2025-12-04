import { PageContainer } from '@/components/layout/PageContainer';
import { BarChart3, Brain, Car, Sparkles, PieChart } from 'lucide-react';
import { getLast7DaysAIUsage, getQuizResults } from '@/services/storage';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Stats = () => {
  const aiUsage = getLast7DaysAIUsage();
  const quizResults = getQuizResults();
  
  const codeResults = quizResults
    .filter(r => r.type === 'code')
    .slice(-10);
  
  const inspiResults = quizResults
    .filter(r => r.type === 'inspiration')
    .slice(-10);

  // Calculate averages for pie charts
  const codeAvg = codeResults.length > 0 
    ? Math.round(codeResults.reduce((a, r) => a + (r.score / r.total) * 100, 0) / codeResults.length)
    : 0;
  
  const inspiAvg = inspiResults.length > 0
    ? Math.round(inspiResults.reduce((a, r) => a + (r.score / r.total) * 100, 0) / inspiResults.length)
    : 0;

  const totalAIUsage = aiUsage.reduce((acc, d) => acc + d.count, 0);

  // Pie chart data
  const quizDistributionData = [
    { name: 'Code', value: codeResults.length, color: 'hsl(340, 80%, 55%)' },
    { name: 'Inspiration', value: inspiResults.length, color: 'hsl(35, 95%, 55%)' },
  ].filter(d => d.value > 0);

  const codeScoreData = codeAvg > 0 ? [
    { name: 'Réussi', value: codeAvg, color: 'hsl(145, 70%, 45%)' },
    { name: 'Échoué', value: 100 - codeAvg, color: 'hsl(220, 15%, 88%)' },
  ] : [];

  const inspiScoreData = inspiAvg > 0 ? [
    { name: 'Réussi', value: inspiAvg, color: 'hsl(175, 80%, 45%)' },
    { name: 'Échoué', value: 100 - inspiAvg, color: 'hsl(220, 15%, 88%)' },
  ] : [];

  const aiByDayData = aiUsage.filter(d => d.count > 0).map((d, i) => ({
    name: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    value: d.count,
    color: `hsl(${270 + i * 10}, 80%, ${55 + i * 3}%)`,
  }));

  const PieChartCard = ({ 
    icon: Icon, 
    title, 
    gradient, 
    data,
    centerValue,
    centerLabel
  }: { 
    icon: any; 
    title: string; 
    gradient: string; 
    data: { name: string; value: number; color: string }[];
    centerValue?: string;
    centerLabel?: string;
  }) => (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`widget-icon ${gradient}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Pas de données
        </div>
      ) : (
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px hsl(var(--glass-shadow))'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </RechartsPie>
          </ResponsiveContainer>
          {centerValue && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginTop: '-18px' }}>
              <span className="text-2xl font-bold text-foreground">{centerValue}</span>
              {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <PageContainer title="Statistiques" subtitle="Votre progression">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Distribution */}
        <div className="animate-slide-up">
          <PieChartCard
            icon={PieChart}
            title="Répartition des quiz"
            gradient="bg-gradient-quiz"
            data={quizDistributionData}
            centerValue={`${quizResults.length}`}
            centerLabel="total"
          />
        </div>

        {/* AI Usage by Day */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <PieChartCard
            icon={Brain}
            title="Utilisation IA (7 jours)"
            gradient="bg-gradient-ai"
            data={aiByDayData}
            centerValue={`${totalAIUsage}`}
            centerLabel="utilisations"
          />
        </div>

        {/* Code Quiz Score */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <PieChartCard
            icon={Car}
            title="Score moyen - Code"
            gradient="bg-gradient-quiz"
            data={codeScoreData}
            centerValue={`${codeAvg}%`}
            centerLabel="moyenne"
          />
        </div>

        {/* Inspiration Quiz Score */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <PieChartCard
            icon={Sparkles}
            title="Score moyen - Inspiration"
            gradient="bg-gradient-inspiration"
            data={inspiScoreData}
            centerValue={`${inspiAvg}%`}
            centerLabel="moyenne"
          />
        </div>

        {/* Summary Card */}
        <div className="glass-card p-5 md:col-span-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="widget-icon bg-gradient-profile">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Résumé global</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <p className="text-3xl font-bold text-foreground">{totalAIUsage}</p>
              <p className="text-xs text-muted-foreground">Utilisations IA (7j)</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <p className="text-3xl font-bold text-foreground">{quizResults.length}</p>
              <p className="text-xs text-muted-foreground">Quiz complétés</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <p className="text-3xl font-bold text-foreground">{codeAvg}%</p>
              <p className="text-xs text-muted-foreground">Moy. Quiz Code</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <p className="text-3xl font-bold text-foreground">{inspiAvg}%</p>
              <p className="text-xs text-muted-foreground">Moy. Quiz Inspi</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Stats;
